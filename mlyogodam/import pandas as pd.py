import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import random
import matplotlib.pyplot as plt

# 파일 경로를 지정합니다.
file_path = '/hack_m_test/re1800.csv'

# 파일을 데이터프레임으로 읽어옵니다.
df = pd.read_csv(file_path, encoding='cp949')

# 단위와 개수를 제거하는 함수
def remove_units(ingredient):
    return re.sub(r'\d+[^\w\s]*\s*', '', ingredient).strip()

# 모든 재료 열을 결합하여 하나의 문자열로 만들기
ingredient_columns = df.columns[5:]  # Assuming the first 5 columns are metadata
# print(f"Ingredient columns: {ingredient_columns}")

df['재료'] = df[ingredient_columns].apply(lambda row: ', '.join([remove_units(ing) for ing in row.dropna() if ing]), axis=1)

# 결측값 처리
df['이름'].fillna('Unknown', inplace=True)

# TF-IDF 벡터화
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df["재료"])

# Nearest Neighbors 모델 학습
nn_model = NearestNeighbors(metric='cosine', algorithm='brute')
nn_model.fit(tfidf_matrix)

# 유사 레시피 추천 함수 정의
def recommend_similar_recipes(recipe_index, nn_model=nn_model, df=df, n_recommendations=5):
    distances, indices = nn_model.kneighbors(tfidf_matrix[recipe_index], n_neighbors=n_recommendations + 1)
    indices = indices.flatten()[1:]  # 자기 자신을 제외한 5개의 유사한 레시피
    distances = distances.flatten()[1:]
    similarities = 1 - distances
    return df['이름'].iloc[indices], distances, similarities

# 특정 키워드를 포함하는 레시피 우선 추천 함수
def recommend_recipes_with_keyword(recipe_index, keyword, nn_model=nn_model, df=df, n_recommendations=5, min_similarity=0.5):
    similar_recipes, distances, similarities = recommend_similar_recipes(recipe_index, nn_model, df, n_recommendations * 2)  # 2배로 추천받고 필터링
    filtered_recipes = [(rec, dist, sim) for rec, dist, sim in zip(similar_recipes, distances, similarities) if dist <= min_similarity]
    
    keyword_recipes = df[df['이름'].str.contains(keyword, na=False)]
    
    if not keyword_recipes.empty:
        keyword_recipes = keyword_recipes[keyword_recipes.index.isin([df[df['이름'] == rec].index[0] for rec, _, _ in filtered_recipes])]
    
    if len(keyword_recipes) >= n_recommendations:
        return keyword_recipes['이름'].head(n_recommendations), [dist for _, dist, _ in filtered_recipes][:n_recommendations], [sim for _, _, sim in filtered_recipes][:n_recommendations]
    else:
        additional_recipes = [rec for rec, _, _ in filtered_recipes if rec not in keyword_recipes['이름']]
        combined_recipes = pd.concat([keyword_recipes['이름'], pd.Series(additional_recipes)]).head(n_recommendations)
        combined_distances = distances[:len(combined_recipes)]
        combined_similarities = similarities[:len(combined_recipes)]
        return combined_recipes, combined_distances, combined_similarities

# 음식 추천 실행
def recommend_random_recipes(df):
    return df.sample(5)

# 유사한 음식과 유사도 거리 출력
def plot_similar_recipes(similar_recipes, distances, similarities):
    plt.figure(figsize=(10, 6))
    plt.barh(similar_recipes, distances, color='skyblue', label='Distance')
    plt.barh(similar_recipes, similarities, color='lightgreen', label='Similarity', left=distances)
    plt.xlabel('유사도 거리 / 유사도')
    plt.title('유사한 음식 추천')
    plt.legend()
    plt.gca().invert_yaxis()
    plt.show()

# 랜덤 추천 음식 5개
random_recipes = recommend_random_recipes(df)
print("추천 음식:")
print(random_recipes[['이름']])

# 랜덤으로 선택된 음식
selected_recipe_index = random.choice(random_recipes.index)
selected_recipe = df['이름'].iloc[selected_recipe_index]

print(f"\n선택된 음식: {selected_recipe}")
print(f"재료: {df['재료'].iloc[selected_recipe_index]}")

# 유사한 음식 5개 추천
keyword = ""  # 키워드를 사용하려면 여기에 입력하세요
similar_recipes, distances, similarities = recommend_recipes_with_keyword(selected_recipe_index, keyword, min_similarity=0.5)

print("\n유사한 음식 추천:")
for name, distance, similarity in zip(similar_recipes, distances, similarities):
    print(f"음식 이름: {name}, 유사도 거리: {distance:.4f}, 유사도: {similarity:.4f}")


from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import random

app = Flask(__name__)
CORS(app)

file_path = './re1800.xlsx'

df = pd.read_excel(file_path)

def remove_units(ingredient):
    return re.sub(r'\d+[^\\w\\s]*\\s*', '', ingredient).strip()

ingredient_columns = df.columns[5:]

df['재료'] = df[ingredient_columns].apply(lambda row: ', '.join([remove_units(ing) for ing in row.dropna() if ing]), axis=1)

df['이름'].fillna('Unknown', inplace=True)

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df["재료"])

nn_model = NearestNeighbors(metric='cosine', algorithm='brute')
nn_model.fit(tfidf_matrix)

def recommend_similar_recipes(recipe_index, nn_model=nn_model, df=df, n_recommendations=5):
    distances, indices = nn_model.kneighbors(tfidf_matrix[recipe_index], n_neighbors=n_recommendations + 1)
    indices = indices.flatten()[1:]
    distances = distances.flatten()[1:]
    similarities = 1 - distances
    return df['이름'].iloc[indices], distances, similarities

def recommend_recipes_with_keyword(recipe_index, keyword, nn_model=nn_model, df=df, n_recommendations=5, min_similarity=0.5):
    similar_recipes, distances, similarities = recommend_similar_recipes(recipe_index, nn_model, df, n_recommendations * 2)
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

def recommend_random_recipes(df):
    return df.sample(5)

@app.route('/recommend', methods=['GET'])
def recommend():
    try:
        random_recipes = recommend_random_recipes(df)
        recipes = random_recipes[['이름', '재료']].to_dict(orient='records')
        return jsonify(recipes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/similar', methods=['OPTIONS', 'POST'])
def similar():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    try:
        data = request.json
        app.logger.info(f"Received data: {data}")

        selected_recipe_name = data.get('name')
        keyword = data.get('keyword', '')

        app.logger.info(f"Selected recipe name: {selected_recipe_name}, Keyword: {keyword}")

        if selected_recipe_name not in df['이름'].values:
            raise ValueError("Selected recipe not found in dataset")

        selected_recipe_index = df[df['이름'] == selected_recipe_name].index[0]
        similar_recipes, distances, similarities = recommend_recipes_with_keyword(selected_recipe_index, keyword)

        response = {
            'selected_recipe': selected_recipe_name,
            'similar_recipes': list(similar_recipes),
            'distances': list(distances),
            'similarities': list(similarities)
        }

        return jsonify(response)
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000)
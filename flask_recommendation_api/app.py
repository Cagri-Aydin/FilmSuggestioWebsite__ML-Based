from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
CORS(app)

# Excel dosyasını yükleme
try:
    file_path = "2000_Movies_Dataset.xlsx"
    df = pd.read_excel(file_path)
    print(f"Excel dosyası başarıyla yüklendi. {len(df)} film bulundu.")
except Exception as e:
    print(f"Excel dosyası yüklenirken hata: {e}")
    df = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "success", "message": "Film öneri API'si çalışıyor"})

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        selected_titles = data.get('selected_titles', [])
        print(f"Seçilen filmler: {selected_titles}")
        
        if not selected_titles:
            return jsonify({"error": "Film seçilmedi"}), 400
            
        # Tüm filmleri kullan, sadece seçilenleri değil
        all_movies = df.copy()
        
        # Özellik seçimi
        features = all_movies[['Genre', 'Release Year', 'Language']]
        
        # One-hot encoding
        encoder = OneHotEncoder()
        encoded_features = encoder.fit_transform(features).toarray()
        
        # KNN modeli - tüm filmler üzerinde
        model = NearestNeighbors(n_neighbors=6, metric='cosine')  # 6 en yakın komşu
        model.fit(encoded_features)
        
        # Seçilen filmlerin indekslerini bul
        selected_indices = df[df['Title'].isin(selected_titles)].index.tolist()
        
        # Önerileri hazırla
        recommendations = []
        for idx in selected_indices:
            # Her seçili film için en yakın komşuları bul
            distances, indices = model.kneighbors([encoded_features[idx]])
            
            # İlk sonuç filmin kendisi olacak, onu atla
            for neighbor_idx in indices[0][1:]:  # ilk elemanı atla
                movie = df.iloc[neighbor_idx]
                if movie['Title'] not in selected_titles and movie['Title'] not in [r['Title'] for r in recommendations]:
                    recommendations.append({
                        'Title': movie['Title'],
                        'Genre': movie['Genre'],
                        'Release Year': int(movie['Release Year']),
                        'Language': movie['Language']
                    })
                if len(recommendations) >= 5:  # En fazla 5 öneri
                    break
        
        print(f"Önerilen filmler: {recommendations}")
        return jsonify(recommendations)
        
    except Exception as e:
        print(f"Hata oluştu: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)

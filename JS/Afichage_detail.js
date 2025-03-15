document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const houseId = params.get('houseId');

    if (!houseId) {
        console.error("Aucun houseId n'a été fourni dans l'URL.");
        return;
    }

    fetch('Data_Base/Immobilier.json')
        .then(response => response.json())
        .then(data => {
            const maisons = data.Maisons;
            const house = maisons.find(m => m.id === houseId);

            if (!house) {
                console.error("Aucune maison ne correspond à l'ID fourni :", houseId);
                return;
            }

            // Sélection des éléments HTML
            const titleEl = document.getElementById('house-title');
            const locationEl = document.getElementById('house-location');
            const priceEl = document.getElementById('price-value');
            const mainImage = document.getElementById('main-image');
            const thumbnailsContainer = document.getElementById('thumbnails');

            // Remplir le titre, la localisation et le prix
            titleEl.textContent = house.description;
            locationEl.textContent = house.ville + ", " + house.pays;
            priceEl.textContent = house.prix_par_nuit;

            // Fonction pour obtenir une image valide à partir d'un tableau donné
            function getValidImages(imagesArray) {
                return (Array.isArray(imagesArray) && imagesArray.length > 0) ? imagesArray : ["erreur_image.jpg"];
            }

            // Récupération des images extérieures et intérieures
            const exterieurImages = getValidImages(house.Exterieur);
            const interieurImages = getValidImages(house.Interieur);
            const allImages = [...exterieurImages, ...interieurImages];

            // Gestion de l'image principale
            let mainImageSrc = "Media/Immobilier/" + allImages[0];
            mainImage.src = mainImageSrc;
            mainImage.onerror = () => {
                mainImage.src = "Media/Immobilier/erreur_image.jpg";
            };

            // ✅ Si le conteneur des vignettes existe :
            if (thumbnailsContainer) {
                thumbnailsContainer.innerHTML = ''; // Nettoyer les vignettes existantes

                // ✅ Créer une structure avec flèches et conteneur
                const upArrow = document.createElement('button');
                upArrow.classList.add('arrow', 'up-arrow');
                upArrow.innerHTML = '▲';

                const thumbnailsWrapper = document.createElement('div');
                thumbnailsWrapper.classList.add('thumbnails-wrapper');

                const downArrow = document.createElement('button');
                downArrow.classList.add('arrow', 'down-arrow');
                downArrow.innerHTML = '▼';

                // ✅ Insérer dans le conteneur
                thumbnailsContainer.appendChild(upArrow);
                thumbnailsContainer.appendChild(thumbnailsWrapper);
                thumbnailsContainer.appendChild(downArrow);

                // ✅ Générer les vignettes
                allImages.forEach((imgName, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = "Media/Immobilier/" + imgName;
                    thumb.alt = `Thumbnail ${index + 1}`;
                    thumb.classList.add('thumbnail');

                    // Gérer l'erreur éventuelle sur la vignette
                    thumb.onerror = () => {
                        thumb.src = "Media/Immobilier/erreur_image.jpg";
                    };

                    // Ajout de l'événement de changement d'image principale
                    thumb.addEventListener('click', () => {
                        mainImage.src = "Media/Immobilier/" + imgName;
                        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    });

                    thumbnailsWrapper.appendChild(thumb);

                    // Définir la première vignette comme active
                    if (index === 0) {
                        thumb.classList.add('active');
                    }
                });

                // ✅ Gestion des flèches de défilement
                const scrollAmount = 100; // Nombre de pixels à faire défiler
                upArrow.addEventListener('click', () => {
                    thumbnailsWrapper.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
                });

                downArrow.addEventListener('click', () => {
                    thumbnailsWrapper.scrollBy({ top: scrollAmount, behavior: 'smooth' });
                });
            }
        })
        .catch(err => {
            console.error("Erreur lors du chargement du JSON :", err);
        });

    // ✅ Gérer le bouton "Réserver"
    const reserveBtn = document.getElementById('reserve-btn');
    if (reserveBtn) {
        reserveBtn.addEventListener('click', () => {
            window.location.href = "Reservation.html";
        });
    }
});

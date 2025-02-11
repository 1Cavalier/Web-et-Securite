CREATE TABLE Client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
);

INSERT INTO `client` (`id`, `nom`, `prenom`, `email`, `telephone`, `mot_de_passe`) VALUES
(1, 'Dupont', 'Jean', 'jean.dupont@exemple.com', '0612345678', '1234'),
(2, 'Martin', 'Sophie', 'sophie.martin@exemple.com', '0698765432', '1235'),
(3, 'Leroy', 'Pierre', 'pierre.leroy@exemple.com', '0644556677', '1236'),
(4, 'Dubois', 'Marie', 'marie.dubois@exemple.com', '0733547612', '1237'),
(5, 'Lambert', 'Luc', 'luc.lambert@exemple.com', '0722749145', '1239');

CREATE TABLE Maisons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    ville VARCHAR(50) NOT NULL,
    pays VARCHAR(50) NOT NULL,
    type ENUM('desert', 'mer', 'campagne', 'montagne', 'foret') NOT NULL,
    prix_par_nuit DECIMAL(10, 2) NOT NULL CHECK (prix_par_nuit BETWEEN 100 AND 10000),
    capacite INT NOT NULL,
    equipements TEXT,
    statut ENUM('disponible', 'reserve') NOT NULL DEFAULT 'disponible'
);

INSERT INTO `maisons` (`id`, `description`, `ville`, `pays`, `type`, `prix_par_nuit`, `capacite`, `equipements`, `statut`) VALUES
(1, 'Belle maison en bord de mer', 'Nice', 'France', 'mer', 150.00, 4, 'WI-FI, Piscine, Jardin', 'disponible'),
(2, 'Chalet cosy en montagne', 'Chamonix', 'France', 'montagne', 200.00, 6, 'Cheminee, Sauna, Terrasse', 'disponible'),
(3, 'Maison traditionnelle dans le désert ', 'Djanet', 'Algérie', 'desert', 120.00, 4, 'Climatisation, Terrasse, Vue sur les dunes', 'reserve'),
(4, 'Cottage traditionnel a la campagne', 'Provence', 'France', '', 180.00, 5, 'Jardin, Barbecue, Animaux acceptes', 'disponible'),
(5, 'Villa luxueuse avec vue sur la mer', 'Canes', 'France', 'mer', 300.00, 8, 'Piscine, Jacuzzi, Wi-Fi', 'disponible'),
(6, 'Cabane isolee dans la foret', 'Annecy', 'France', 'foret', 100.00, 2, 'Terrasse, Animaux acceptes', 'reserve');


CREATE TABLE Reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    locataire_id INT,
    maison_id INT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut ENUM('en attente', 'confirmee', 'annulee') NOT NULL DEFAULT 'en attente',
    FOREIGN KEY (locataire_id) REFERENCES Client(id) ON DELETE CASCADE,
    FOREIGN KEY (maison_id) REFERENCES Maisons(id) ON DELETE CASCADE
);

INSERT INTO `reservations` (`id`, `locataire_id`, `maison_id`, `date_debut`, `date_fin`, `statut`) VALUES
(1, 1, 1, '2023-12-01', '2023-12-07', 'confirmee'),
(2, 2, 3, '2023-11-15', '2023-11-20', 'annulee'),
(3, 1, 2, '2024-01-10', '2024-01-15', 'en attente'),
(4, 3, 4, '2024-02-01', '2024-02-07', 'confirmee'),
(5, 4, 5, '2024-03-01', '2024-03-10', 'en attente'),
(6, 5, 6, '2024-04-15', '2024-04-20', 'confirmee');


CREATE TABLE Avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    locataire_id INT,
    maison_id INT,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    date_avis DATE NOT NULL,
    FOREIGN KEY (locataire_id) REFERENCES Client(id) ON DELETE CASCADE,
    FOREIGN KEY (maison_id) REFERENCES Maisons(id) ON DELETE CASCADE
);

INSERT INTO `avis` (`id`, `locataire_id`, `maison_id`, `note`, `commentaire`, `date_avis`) VALUES
(1, 1, 1, 5, 'Superbe sejour, tout etait parfait !', '2025-01-02'),
(2, 2, 3, 3, 'Bien, mais un peu isole.', '2023-11-25'),
(3, 1, 2, 4, 'Chalet tres confortable, je recommande.', '2024-01-20'),
(4, 3, 4, 5, 'Un cadre magnifique, tres calme.', '2024-02-10'),
(5, 4, 5, 4, 'Villa de reve, un peu chere.', '2024-03-15'),
(6, 5, 6, 5, 'Parfait pour un week-end en amoureux.', '2024-08-15');

CREATE TABLE Paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT,
    montant DECIMAL(10, 2) NOT NULL,
    statut ENUM('paye', 'en attente', 'annule') NOT NULL DEFAULT 'en attente',
    methode_paiement ENUM('carte', 'PayPal', 'autre') NOT NULL,
    date_paiement DATE NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES Reservations(id) ON DELETE CASCADE
);

INSERT INTO `paiements` (`id`, `reservation_id`, `montant`, `statut`, `methode_paiement`, `date_paiement`) VALUES
(1, 1, 1050.00, 'paye', 'carte', '2023-11-20'),
(2, 2, 600.00, 'annule', 'PayPal', '2023-11-10'),
(3, 3, 1000.00, 'en attente', 'carte', '2024-01-05'),
(4, 4, 1260.00, 'paye', 'carte', '2024-01-25'),
(5, 5, 2700.00, 'en attente', 'PayPal', '2024-02-20'),
(6, 6, 500.00, 'paye', 'carte', '2024-04-10');

CREATE TABLE Photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maison_id INT,
    url_photo VARCHAR(255) NOT NULL,
    FOREIGN KEY (maison_id) REFERENCES Maisons(id) ON DELETE CASCADE
);


INSERT INTO `photos` (`id`, `maison_id`, `url_photo`) VALUES
(1, 1, 'https://example.com/maison1.jpg'),
(2, 1, 'https://example.com/maison1_interieur.jpg'),
(3, 2, 'https://example.com/chalet_montagne.jpg'),
(4, 3, 'https://example.com/maison_desert.jpg'),
(5, 4, 'https://example.com/cottage_campagne.jpg'),
(6, 5, 'https://example.com/villa_luxueuse.jpg');

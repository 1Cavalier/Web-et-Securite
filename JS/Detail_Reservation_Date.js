document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const houseId = params.get('houseId');
    if (!houseId) {
        console.error("Aucun houseId fourni dans l'URL.");
        return;
    }

    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    fetch('Data_Base/Reservation.json')
        .then(response => response.json())
        .then(data => {
            const reservations = data.reservations.filter(res => res.idImmobilier === houseId);
            let reservedDates = [];

            // Collecte des dates réservées
            reservations.forEach(res => {
                let currentDate = new Date(res.dateDebut);
                const endDate = new Date(res.dateFin);

                while (currentDate <= endDate) {
                    reservedDates.push(currentDate.toISOString().split('T')[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            });

            // Configuration du calendrier Flatpickr
            let checkinCalendar = flatpickr(checkinInput, {
                dateFormat: "Y-m-d",
                disable: reservedDates.map(date => ({ from: date, to: date })),
                minDate: new Date().fp_incr(1), // Date minimum : lendemain de la date actuelle
                locale: {
                    firstDayOfWeek: 1 // Lundi comme premier jour
                },
                onChange: (selectedDates) => {
                    if (selectedDates.length > 0) {
                        const minCheckoutDate = new Date(selectedDates[0]);
                        minCheckoutDate.setDate(minCheckoutDate.getDate() + 1); // La date de fin doit être au moins le lendemain
                        checkoutCalendar.set('minDate', minCheckoutDate);

                        // Optionnel : Réinitialiser la date de départ si elle est avant la nouvelle minDate
                        if (checkoutInput.value && new Date(checkoutInput.value) <= minCheckoutDate) {
                            checkoutInput.value = '';
                        }
                    }
                }
            });

            let checkoutCalendar = flatpickr(checkoutInput, {
                dateFormat: "Y-m-d",
                disable: reservedDates.map(date => ({ from: date, to: date })),
                minDate: new Date().fp_incr(2), // Par défaut, au moins le surlendemain
                locale: {
                    firstDayOfWeek: 1
                }
            });
        })
        .catch(err => console.error("Erreur lors du chargement des réservations :", err));
});

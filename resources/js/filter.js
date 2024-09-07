document.addEventListener("DOMContentLoaded", function() {
const allBtn = document.getElementById("all-btn");
const vegBtn = document.getElementById("veg-btn");
const nonVegBtn = document.getElementById("non-veg-btn");
const pizzasContainer = document.getElementById("pizzas-container");
const pizzaItems = pizzasContainer.getElementsByClassName("pizza-item");
const allPizzasTitle = document.getElementById("all-pizzas-title");

allBtn.addEventListener("click", function() {
    filterPizzas("all");
    allPizzasTitle.style.display = "block";
});

vegBtn.addEventListener("click", function() {
    filterPizzas("veg");
    allPizzasTitle.style.display = "none";
});

nonVegBtn.addEventListener("click", function() {
    filterPizzas("non-veg");
    allPizzasTitle.style.display = "none";
});

function filterPizzas(type) {
    Array.from(pizzaItems).forEach(function(item) {
        if (item.getAttribute("data-type") === type || type === "all") {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}
});

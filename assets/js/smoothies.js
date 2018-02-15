//Local smoothie data (used in place of of the Shopify API)
const products = [
    {
        product_id: "8000152364",
        variant_id: "60058324",
        available: "Available",
        title: "Watermelon + Cucumber",
        details: "Decompress with this spa-inspired blend, filled with supremely hydrating ingredients like watermelon, cucumber and coconut water. We've sweetened the deal with organic raspberries and lime juice, and given you a hearty dose of Omega-3s with the addition of chia seeds and sea buckthorn to prevent inflammation and destruction from free radicals. Sip by sip, let tranquility take over as you embrace the Ohm.",
        src: "https://www.daily-harvest.com/static/img/products/WatermelonCucumber/product-shot-ingredients@3x.jpeg"
    },
    {
        product_id: "8000152365",
        variant_id: "60058325",
        available: "Available",
        title: "Acai + Cherry",
        details: "Fresh berries are yet another reason why we're always living for summer. But this multi-berry blend gives us that fresh-picked taste year round, with sweet cherries, blueberries, raspberries and a hearty dose of glow-inducing acaí berries, for a smoothie high in antioxidants and Omega 3's. Plus, we've added some kale in for good measure - but trust us, you won't even notice it's there.",
        src: "https://www.daily-harvest.com/static/img/products/AcaiCherry/product-shot-ingredients@3x.jpeg"
    },
    {
        product_id: "8000152366",
        variant_id: "60058326",
        available: "Available",
        title: "Mango + Papaya",
        details: "We're convinced a tropical vacation can cure virtually any ailment, so by the transitive property, this tropical blend has healing powers as well (but closing your eyes and picturing the ocean helps). Aside from its transportive qualities, this smoothie superhero is packed with Vitamin C and antioxidants, key antidotes for what ails you. Mango, papaya, pineapple and acerola cherry are also loaded with hydration and free radical-fighting goodness. Add a dose of macadamia nut for some protein and healthy fat, and you will be feeling beachy-keen in no time.",
        src: "https://www.daily-harvest.com/static/img/products/MangoPapaya/product-shot-ingredients@3x.jpeg"
    },
    {
        product_id: "8000152367",
        variant_id: "60058327",
        available: "Available",
        title: "Pineapple + Matcha",
        details: "If you like piña coladas and getting caught in the rain, chances are you'll love this drink too. Filled with manganese- and Vitamin C-rich pineapple and fat-burning coconut plus a dose of green tea's power-cousin matcha, this blend will get you going in the morning in a way that actually getting caught in the rain never would.",
        src: "https://www.daily-harvest.com/static/img/products/PineappleMatcha/product-shot-ingredients@3x.jpeg"
    }
];

//Store user's plan/subtotal and cart array
var planCost = 0, planQty = 0;
var cart = [];

//Append all products to HTML element
for (var x = 0; x < products.length; x++) {

    //New image element with smoothie class, image src, modal attributes, and product information
    var newSmoothie = $("<img>").addClass("smoothie img-fluid").attr({
        "src": products[x].src,
        "data-toggle": "modal",
        "data-target": "#product-view",
        "smoothie-ID": products[x].product_id,
        "variant-ID": products[x].variant_id,
        "in-stock": products[x].available,
        "smoothie-title": products[x].title,
        "smoothie-details": products[x].details
    });

    //h6 for the smoothie title
    var smoothieTitle = $("<h6>").html(products[x].title);

    //Append newSmoothie to a div that contains the entire product
    var newDiv = $("<div class = 'col-sm-6 col-md-3'>").append(newSmoothie, smoothieTitle);

    //Append the newSmoothie div to the section on the HTML file
    $("#shopifyImg").append(newDiv);
}

//On subscription/plan btn click...
$(document).on("click", ".plan-btn", function () {
    //update user's subscription
    planName = $(this).attr("plan-name");
    planQty = parseInt($(this).attr("plan-qty"));
    planCost = parseFloat($(this).attr("plan-cost"));

    //Update plan-btn innerHTML
    $(".plan-btn").html("BLEND ME!");
    this.innerHTML = $(this).attr("plan-name") + ' \u2714';
});

//On smoothie click update the modal content
$(document).on("click", ".smoothie", function () {
    //Image, product/variant ID, availability
    $(".modal-img").attr({
        "src": $(this).attr("src"),
        "smoothie-ID": $(this).attr("smoothie-ID"),
        "variant-ID": $(this).attr("variant-ID"),
        "in-stock": $(this).attr("in-stock")
    });
    //Title
    $(".modal-title").html($(this).attr("smoothie-title"));
    //Details
    $(".modal-details").html($(this).attr("smoothie-details"));
    //Reset dropdown value to default (1)
    $("#quantity").val(1);
});

//On add-btn click...
$(document).on("click", ".add-btn", function () {
    //Grab product ID and quantity from the modal (which displays selected product)
    var productID = parseInt($(".modal-img").attr("smoothie-ID"));
    var amount = parseInt($("#quantity").val());

    //Create a new addedProduct object
    addedProduct = {
        product_id: $(".modal-img").attr("smoothie-id"),
        src: $(".modal-img").attr("src"),
        title: $(".modal-title").html(),
        quantity: amount
    }

    //Push addedProduct to the cart array
    cart.push(addedProduct);
});

//On cart-btn click...
$(document).on("click", ".cart-btn", function () {
    //generate checkout URL (new href)
    //$(".checkout-link").attr("href", cart.checkoutUrl);
    //Clear previous items
    $(".cart-body").empty();
    //Iterate through cart
    for (var c = 0; c < cart.length; c++) {
        //Get image src, title, quantity from items in cart
        var cartItemImg = $("<td>").append($("<img class='img-fluid checkout-img' width='75'>").attr("src", cart[c].src));
        var cartItemTitle = $("<td>").html(cart[c].title);
        var cartItemId = $("<td>").html(cart[c].product_id);
        var cartItemQty = $("<td>").html(cart[c].quantity);

        //Append to new div that contains img, title, qty info
        var cartItemRow = $("<tr>").append(cartItemImg, cartItemTitle, cartItemId, cartItemQty);

        //Append to correct location
        $(".cart-body").append(cartItemRow);

        /*If there's no subscription plan business model, calculate subtotal (price * quantity, retrieved from server)
            subtotal += (parseFloat(cart.attrs.line_items[c].price) * cart.attrs.line_items[c].quantity);*/
    }
    //Update subtotal (subscription cost)
    $(".subtotal").html("Subtotal: $" + planCost.toFixed(2));
});

//When the checkout button is clicked
$(document).on("click", ".checkout-link", function () {
    $("#cart-modal").modal("hide"); //Hide modal

    //Store the total product quantity in cart
    let totalQuantity = 0;
    cart.forEach(item => {
        totalQuantity += parseInt(item.quantity)
    })
    
    //If user has not selected a plan
    if (planCost == 0) {
        alert("Please select a smoothie plan");
    }
    //If user needs more smoothies to fulfill their plan
    else if (planCost !== 0 && totalQuantity < planQty) { 
        alert(`Please select ${planQty-totalQuantity} more smoothies to fulfill your smoothie plan.`);
    }
    else {
        alert("Thanks for choosing Fresh Gatherer! With Shopify enabled, you'd be directed to the generated checkout URL to finalize your payment method and place your order.");
    }
});
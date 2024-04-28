import menuItems from "./menu.js";

//take order buttom
document.querySelector("#take-order-btn").addEventListener("click", (e) => {
  document.querySelector(".bill-div").removeAttribute("hidden");
});

//take order cancel button
// document.querySelector("#take-order-cancel-btn").addEventListener("click",(e)=>{
//     document.querySelector(".bill-div").setAttribute("hidden","")
// })
document
  .querySelector("#take-order-cancel-btn")
  .addEventListener("click", (e) => {
    // Reset the quantity input field
    document.querySelector("#dish-quantity").value = 1;

    // Reset the radio buttons for payment type to their default state
    document.querySelector("#payment-type-Cash").checked = true;
    document.querySelector("#payment-type-UPI").checked = false;

    // Clear the table rows in the order list
    let orderList = document.querySelector("#order-list");
    while (orderList.firstChild) {
      orderList.removeChild(orderList.firstChild);
    }

    // Reset the total payment to Rs 0
    total = 0;
    document.querySelector("#total-payment").textContent = "Rs 0";

    // Reset the payment type text
    document.querySelector("#payment-type-value").textContent = "";

    // Hide the bill-div
    document.querySelector(".bill-div").setAttribute("hidden", "");
  });

//take order submit button
document.querySelector("#take-order-submit-btn").addEventListener("click", (e) => {
  let payment_type = null;
  if (document.querySelector("#payment-type-Cash").checked) {
    payment_type = "Cash";
  } else if (document.querySelector("#payment-type-UPI").checked) {
    payment_type = "UPI";
  }
  // Create input element for payment type
  let paymentTypeInput = document.createElement("input");
  paymentTypeInput.setAttribute("type", "text");
  paymentTypeInput.setAttribute("id", "payment-type-value");
  paymentTypeInput.setAttribute("name", "payment_type");
  paymentTypeInput.setAttribute("value", payment_type);
  paymentTypeInput.setAttribute("readonly", true);
  paymentTypeInput.setAttribute("style", "border: none; outline: none;");
  
  // Append input element to the payment-type div
  document.getElementById("payment-type").innerHTML = paymentTypeInput.outerHTML;
});
let selectedItem = "";

//inserting the object list into dropdown list, searching and selecting the items

document.querySelector("#modal-btn").addEventListener("click", (e) => {
  const ul = document.querySelector("#menu-item-list");
  if(ul.childElementCount == 0){
    menuItems.forEach((item) => {
      let li = document.createElement("li");
      li.classList.add("list-group-item");
      li.textContent = item.name;
      ul.appendChild(li);
    });
  }


  // Add event listener for filtering after list items have been inserted
  document.getElementById("searchInput").addEventListener("input", function () {
    let filter = this.value.toUpperCase();
    let lis = ul.getElementsByTagName("li");
    for (var i = 0; i < lis.length; i++) {
      var name = lis[i].textContent || lis[i].innerText;
      if (name.toUpperCase().indexOf(filter) > -1) {
        lis[i].style.display = "";
      } else {
        lis[i].style.display = "none";
      }
    }
  });

  //getting selected item on search bar
  document.querySelectorAll(".list-group-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.getElementById("searchInput").value = item.textContent;
    });
  });

  //selecting those items
  document.querySelector("#select-item-btn").addEventListener("click", () => {
    selectedItem = document.getElementById("searchInput").value;
  });

  document.getElementById("searchInput").value = "";
});

//total money variable
let total = 0;
//take order add dish button
document.querySelector("#add-dish-btn").addEventListener("click", (e) => {
  console.log("clicked");
  if (selectedItem === "") {
    alert("Enter a Dish");
  } else {
    let price;
    //getting price
    menuItems.forEach((item) => {
      if (selectedItem === item.name) {
        price = item.price;
      }
    });
    let quantity = document.querySelector("#dish-quantity").value;
    let itemNameSize = selectedItem.length;
let quantitySize = quantity.toString().length;
let priceSize = (`Rs${price}`).length;

// Create input element for item name
let item_name = document.createElement("td");
item_name.innerHTML = `<input type="text" value="${selectedItem}" readonly name="item_name[]" class="newcontent" id="cf-item_name" style="width: 100px; border: none; outline: none; ">`;

// Create input element for quantity
let quantity_obj = document.createElement("td");
quantity_obj.innerHTML = `<input type="number" value="${quantity}" readonly name="quantity[]" class="newcontent" id="cf-quantity"style="width: 30px; border: none; outline: none;">`;

// Create input element for price
let price_obj = document.createElement("td");
price_obj.innerHTML = `<input type="text" value="${price}" readonly name="price[]" class="newcontent" id="cf-price" style="width: 55px; border: none; outline: none;">`;
    let dish_row = document.createElement("tr");
    dish_row.appendChild(item_name);
    dish_row.appendChild(quantity_obj);
    dish_row.appendChild(price_obj);
    console.log(dish_row);
    document.querySelector("#order-list").appendChild(dish_row);
    total = total + quantity * price;

// Create input element for total payment
let totalPaymentInput = document.createElement("input");
totalPaymentInput.setAttribute("type", "text");
totalPaymentInput.setAttribute("id", "total-payment-value");
totalPaymentInput.setAttribute("name", "total_payment");
totalPaymentInput.setAttribute("value", `${total}`);
totalPaymentInput.setAttribute("readonly", true);
totalPaymentInput.setAttribute("style", "border: none; outline: none;");

// Append input element to the total-payment div
document.getElementById("total-payment").innerHTML = totalPaymentInput.outerHTML;
  
  }
  document.querySelector("#dish-quantity").value = 1;
});
// document.querySelector("#genpdf").addEventListener("click", () => {
//   console.log("clicked");
//   let total = document.querySelector("#total-payment").textContent
//   let paymentType = document.querySelector("#payment-type-value").textContent
//   console.log(paymentType)
//   console.log(total)
//   if(total == "Rs 0"){
//     alert("Select Dishes")
//   } else if(paymentType == ""){
//     alert("Payment Type not selected")
//   } else{
//     console.log("success")
    
//   }
// })

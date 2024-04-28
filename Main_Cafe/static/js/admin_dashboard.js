import  menuItems  from "./menu.js"

//menu management Code
//add dish
document.querySelector("#add-dish-submit-btn").addEventListener("click",()=>{
    let dish_name = document.querySelector("#add-dish-name-input").value
    let dish_price = document.querySelector("#add-dish-price-input").value

    if(dish_name === ""){
        alert("Enter Dish Name")
    } else if(dish_price == 0){
        alert("Enter Dish Price")
    } else{
        console.log(menuItems.length)
    }
})

//adding items in list
document.querySelector("#update-dish-btn").addEventListener("click", (e) => {
    const ul = document.querySelector("#menu-item-list");
    if (ul.childElementCount == 0){
      menuItems.forEach((item) => {
        let li = document.createElement("li");
        li.classList.add("list-group-item");
        li.classList.add("d-flex")
        li.innerHTML ='<div class="container-fluid d-flex"><span class="item-name">'+ item.name +'</span> <span class="item-price"> <input type="number" value="'+item.price+'"></input></span></div> <button class="btn btn-outline-primary btn-sm update-btn-inside">Update</button>' 
        ul.appendChild(li);
      })
      
    }



      // Add event listener for filtering after list items have been inserted
  // Add event listener for filtering after list items have been inserted
  document.querySelector(".search-input").addEventListener("input", function () {

    console.log("Hello")
    let filter = this.value.toUpperCase();
    let lis = ul.querySelectorAll("li");
    for (var i = 0; i < lis.length; i++) {
      var name = lis[i].querySelector(".item-name").textContent || lis[i].querySelector(".item-name").innerText;
      if (name.toUpperCase().indexOf(filter) > -1) {
        lis[i].classList.remove("hidden")
      } else {
        lis[i].classList.add("hidden")
      }
    }
  });


  //update button functionality
  let list = ul.querySelectorAll("li")
  for(var i = 0; i < list.length; i++){
    let inputField = list[i].querySelector(".item-price input")
    let itemName = list[i].querySelector(".item-name").textContent
    list[i].querySelector("button").addEventListener("click",() => {
      let inputFieldVal = inputField.value
      console.log(itemName)
      console.log(inputFieldVal)
      //code here
      let dish = []
      dish.push(itemName)
      dish.push(inputFieldVal)
      $.ajax({
        type: "POST",
        url: "/menu/",
        data: JSON.stringify(dish),
        success: function (response) {
          console.log("data sent succesfully")
          window.location.reload(true);
        },
        error: function (xhr, status, error){
          console.error(xhr.responseText)
        },
      });
      
    })
  }

})

//code here

document.getElementById("getemp").addEventListener("click",function(){
  let ul = document.querySelector(".emp-list")
  $.ajax({
    type: "POST",
    url: "/viewemp/",
    success: function(response){
      if(ul.childElementCount == 0){
          response.forEach((item,index)=>{
              let li = document.createElement("li")
              li.classList.add("list-group-item");
              li.innerHTML = '<div class="emp d-flex"><span class="index-no">'+(index+1)+'</span> <span class="emp-name">'+item.username+'</span> <span class="emp-doj">'+item.date_joined.slice(0,10)+'</span> <button class="btn btn-outline-danger btn-sm delete-usr-btn"> Delete </button> </div>'
              
                  // Attach event listener to the newly created button
              li.querySelector(".delete-usr-btn").addEventListener("click", function() {
                sendUsername(item.username);
              });
  
              ul.appendChild(li)
          })
        }
    },
    error: function(xhr,status,error){
      console.error(error)
    }
  })
})


//view bill
// document.getElementById("getbill").addEventListener("click",function(){
//   $.ajax({
//     type:"POST",
//     url:"/viewbill/",
//     success: function(response){
//         let ul = document.querySelector(".bill-list")
//         if(ul.childElementCount == 0){
//           response.forEach((item,index)=>{
//             console.log(item)
//             let li = document.createElement("li")
//               li.classList.add("list-group-item")
//               li.innerHTML = '<div class="bill-details d-flex container"><span class="index">'+(index+1)+'</span> <span class="bill-no"> '+item.bill_id+'</span> <span class="payment">'+item.payment+'</span> <span class="total">'+item.total+'</span>  <button class="btn btn-outline-primary view-bill-inside-btn" data-toggle="modal" data-target="#individual-bill-modal"> view </button> </div>'
//               ul.appendChild(li)

//               li.querySelector(".view-bill-inside-btn").addEventListener("click",() => {
//                 console.log("clicked")
//               })

//           })
//         }
//     },
//     error: function(xhr,status,error){
//       console.log(error)
//     }
//   })
// })

document.getElementById("getbill").addEventListener("click", function() {
  $.ajax({
    type: "POST",
    url: "/viewbill/",
    success: function(response) {
      let ul = document.querySelector(".bill-list");
      if (ul.childElementCount == 0) {
        response.forEach((item, index) => {
          let li = document.createElement("li");
          li.classList.add("list-group-item");
          li.innerHTML = '<div class="bill-details d-flex container">' +
                            '<span class="index">' + (index + 1) + '</span>' +
                            '<span class="bill-no"> ' + item.bill_id + '</span>' +
                            '<span class="payment">' + item.payment + '</span>' +
                            '<span class="total">' + item.total + '</span>' +
                          '</div>';
          ul.appendChild(li);

          // Bind click event handler to the newly created button
          // li.querySelector(".view-bill-inside-btn").addEventListener("click", function() {
            
          // });
        });
      }
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });
});



document.getElementById("getbill-delete").addEventListener("click",function(){
  $.ajax({
    type:"POST",
    url:"/viewbill/",
    success: function(response){
        let ul = document.querySelector("#delete-bill-list")
        if(ul.childElementCount == 0){
          response.forEach((item,index)=>{
            console.log(item)
            let li = document.createElement("li")
              li.classList.add("list-group-item")
              li.innerHTML = '<div class="bill-details delete-bill-details d-flex container"><span class="index">'+(index+1)+'</span> <span class="bill-no delete-bill-no"> '+item.bill_id+'</span> <span class="payment delete-bill-payment">'+item.payment+'</span> <span class="total">'+item.total+'</span> <button class="btn btn-outline-danger delete-dish-submit-btn delete-bill-btn">Delete</button> </div>'
              li.querySelector(".delete-dish-submit-btn").addEventListener("click", function() {
                sendBillNo(item.bill_id);
              });
              ul.appendChild(li)
          })
        }
    },
    error: function(xhr,status,error){
      console.log(error)
    }
  })
  
})

//send data to backend

function sendUsername(username){

  var dataToSend = {
    "username" : [username]
  }
  console.log(username)
  $.ajax({
    type: "POST",
    url: "/empdelete/",
    data: JSON.stringify(dataToSend),
    success : function (response) {
        console.log("data sent successfully")
        location.reload(true)
    },
    error: function (xhr,status,error){
      console.error(error)
    }
  })
}

function sendBillNo(billNo){

  var dataToSend = {
    "bill_no" : [billNo]
  }

  $.ajax({
    type: "POST",
    url: "/billdelete/",
    data: JSON.stringify(dataToSend),
    success : function (response) {
        console.log("data sent successfully")
        location.reload(true)
        
    },
    error: function (xhr,status,error){
      console.error(error)
    }
  })

}


//delete btn 
//making list
// document.querySelector("#delete-dish-btn").addEventListener("click", (e) => {
//   const ul = document.querySelector("#delete-menu-item-list");
//   menuItems.forEach((item) => {
//     let li = document.createElement("li");
//     li.classList.add("list-group-item");
//     li.classList.add("d-flex")
//     li.innerHTML ='<div class="container-fluid d-flex"><span class="item-name">'+ item.name +'</span> <span class="item-price"> <input type="number" value="'+item.price+'" disabled></input></span></div> <button class="btn btn-outline-danger btn-sm delete-btn-inside">Delete</button>' 
//     ul.appendChild(li);
//   })



//   document.querySelector("#delete-item-search-input").addEventListener("input", function () {

//     let filter = this.value.toUpperCase();
//     let lis = ul.querySelectorAll("li");
//     for (var i = 0; i < lis.length; i++) {
//       var name = lis[i].querySelector(".item-name").textContent || lis[i].innerText;
//       if (name.toUpperCase().indexOf(filter) > -1) {
//         lis[i].classList.remove("hidden")
//       } else {
//         lis[i].classList.add("hidden")
//       }
//     }
//   });

//   //delete code here
//   let list = ul.querySelectorAll("li")

//   for(var i = 0; i < list.length; i++){
//     let dishName = list[i].querySelector(".item-name").textContent
//     list[i].querySelector("button").addEventListener("click",()=>{
//       console.log(dishName)
//     })
//   }


// })
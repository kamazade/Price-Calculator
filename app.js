// Storage Controller
const StorageController = (function(){

    return {
        storeProduct:function(product){
            let products;
            
            if(localStorage.getItem("products") === null){
                products = [];
                products.push(product);
            }else{
                products = JSON.parse(localStorage.getItem("products"))
                products.push(product)
            }
            localStorage.setItem("products",JSON.stringify(products)) 
        },
        getProducts:function(){
            let products;
            if(localStorage.getItem("products") == null){
                products = [];
            }else{
                products = JSON.parse(localStorage.getItem("products"));
            }
            return products;
        },
        updateProduct:function(product){
            let products = JSON.parse(localStorage.getItem("products"));
            products.forEach(function(prd,index){
                if(product.id == prd.id){
                    products.splice(index,1,product);
                }
            })
            localStorage.setItem("products",JSON.stringify(products))
        },
        deleteProduct:function(product){
            const products = JSON.parse(localStorage.getItem("products"))
            products.forEach(function(prd,index){
                if(prd.id == product.id){
                    products.splice(index,1)
                }
            })
            localStorage.setItem("products",JSON.stringify(products))
        }
    }

})();


// Product Controller
const ProductController = (function(){
    //private
    const Product = function(id,name,price){
        this.id = id;
        this.name = name;
        this.price = price;
    };
    const data = {
        products : StorageController.getProducts(),
        selectedProduct : null,
        totalPrice:0
        
    }

    return{
        //public
        getProducts : function(){
            return data.products;
        },
        getData : function(){
            return data;
        },
        getProductById:function(id){
            let product = null;
            data.products.forEach(prd=>{
                if(prd.id == id){
                    product = prd
                }
            })

            return product
        },
        addProduct:function(name,price){
            let id;
            if(data.products.length > 0){
                id=data.products[data.products.length-1].id+1;
            }else{
                id=0;
            }
            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        //total price
        getTotal: function(){ 
            data.totalPrice=0;
            data.products.forEach(prd=>{
                data.totalPrice+=prd.price
            })
            return(data.totalPrice)
        },
        setCurrentProduct:function(product){
            data.selectedProduct =product;
        },  
        getCurrentProduct:function(){
            return data.selectedProduct;
        },
        updateProduct:function(name,price){
            let product = null;
            const id  = data.selectedProduct.id
            data.products.forEach(prd =>{
                if(prd.id == id){
                    prd.name = name;
                    prd.price = parseFloat(price)
                    product = prd;
                }
            })

            return product;
        },
        //delete from data products
        deleteProduct:function(product){
            data.products.forEach(function(prd,index){
                if(prd.id == product.id){
                    data.products.splice(index,1);
                }
            })
        }
    }
})();



// UI Controller

const UIController = (function(){
    const Selectors ={
        productList :"#item-list",
        productListItems :"#item-list tr",
        addBtn : "#addButton",
        saveBtn: "#saveButton",
        deleteBtn: "#deleteButton",
        cancelBtn: "#cancelButton",
        productName:"#productName",
        productPrice:"#productPrice",
        productCard:"#productCard",
        totalTL:"#total-tl",
        totalUSD:"#total-dolar"
    }
    return{
        createProductList:function(products){
            let html ="";

            products.forEach(product => {
               html+=`
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price} $</td>
                        <td class="text-right"><button type="submit" class="btn btn-warning btn-sm mt-2"><i class="fa-solid fa-pen-to-square"></i></button></td>
                    </tr>
                `
            });
            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors:function(){
            return Selectors;
        },
        addProduct:function(prd){
            document.querySelector(Selectors.productCard).style.display = "block";
            let addHtml=`
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                <i class="fa-solid fa-pen-to-square bg-warning p-2 editbtn " style="border-radius:5px "></i>
                </td>
            </tr>
            
            `;
            document.querySelector(Selectors.productList).innerHTML += addHtml;

        },
        clearInput:function(){
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        hideCard:function(){
            document.querySelector(Selectors.productCard).style.display = "none";
        },
        //add Total
        addTotal:function(ttl){
           try{
            document.querySelector(Selectors.totalUSD).innerHTML = (ttl)
            document.querySelector(Selectors.totalTL).innerHTML = (ttl*14)
           }
           catch(err){
               console.log(err)
           }
        },
        //add selected product to form
        addProductToForm:function(){
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value= selectedProduct.name
            document.querySelector(Selectors.productPrice).value= selectedProduct.price
        },
        addState :function(){
            UIController.clearWarnings();
            UIController.clearInput();
            document.querySelector(Selectors.addBtn).style.display ="inline";
            document.querySelector(Selectors.saveBtn).style.display ="none";
            document.querySelector(Selectors.deleteBtn).style.display ="none";
            document.querySelector(Selectors.cancelBtn).style.display ="none";
        },
        editState:function(tr){
            this.clearWarnings();
            tr.classList.add("bg-warning");
            document.querySelector(Selectors.addBtn).style.display ="none";
            document.querySelector(Selectors.saveBtn).style.display ="inline";
            document.querySelector(Selectors.deleteBtn).style.display ="inline";
            document.querySelector(Selectors.cancelBtn).style.display ="inline";
        },
        updateProduct:function(prd){
            let updatedItem =null;
            let items = document.querySelectorAll(Selectors.productListItems)
            items.forEach(item=>{
                if(item.classList.contains("bg-warning")){
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price +" $";
                    updatedItem =item ;

                }
            })
            
            
            return updatedItem;
        },
        clearWarnings:function(){
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item =>{
                item.classList.remove("bg-warning")
            })
        },
        // Delete From UI
        deleteProduct:function(){
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item=>{
                if(item.classList.contains("bg-warning")){
                    item.remove();
                }
            })


        }



    }
    

})();



// App Controller
const App = (function(UIctrl,ProductCtrl,StorageCtrl){
    const UISelectors = UIctrl.getSelectors();
    // Load Event Listeners
    const loadEventListeners =function(){
        //add product event
        document.querySelector(UISelectors.addBtn).addEventListener("click",productAddSubmit)
        //**********  edit product event*****************
        // edit product click
        document.querySelector(UISelectors.productList).addEventListener("click",productEditClick);
        // edit product submit
        document.querySelector(UISelectors.saveBtn).addEventListener("click",productEditSubmit);
        // cancel event
        document.querySelector(UISelectors.cancelBtn).addEventListener("click",cancelUpdate);
        
        //************delete event *********

        document.querySelector(UISelectors.deleteBtn).addEventListener("click",deleteProductSubmit);


    };

    const productAddSubmit = function(e){
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName!=="" && productPrice!==""){
            //add product to ProductContoller -> data-> products
            const newProduct = ProductCtrl.addProduct(productName,productPrice);
            // Add Product to UI
            UIctrl.addProduct(newProduct);
            // Add Product to LS
            StorageCtrl.storeProduct(newProduct);


            //get total
            const total = ProductCtrl.getTotal();
            //add total
            UIctrl.addTotal(total);

            //clear inputs
            UIctrl.clearInput();
        }


        e.preventDefault();
    };
    const productEditClick = function(e){
        const target = e.target;
        if(target.classList.contains("editbtn")){
            const id = target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent

            // get selected element
            const product = ProductCtrl.getProductById(id);
            //set current product
            ProductCtrl.setCurrentProduct(product);
            // add product to UI
            UIctrl.addProductToForm();
            UIctrl.editState(target.parentElement.parentElement);
        }
        e.preventDefault();
    };
    const productEditSubmit = function(e){
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if(productName !== "" && productPrice !== ""){
            //Update Product
            const updatedProduct =ProductCtrl.updateProduct(productName,productPrice);
            // Update UI
            let item  = UIctrl.updateProduct(updatedProduct);
            //get total 
            const total = ProductCtrl.getTotal();
            //add total UI
            UIctrl.addTotal(total);
            UIctrl.addState()
            // Update Storage
            StorageCtrl.updateProduct(updatedProduct);
            UIctrl.clearWarnings();
        }


        
        e.preventDefault();
    };
    const cancelUpdate = function(e){
        UIctrl.addState();
        UIctrl.clearWarnings();

        e.preventDefault();
    }
    const deleteProductSubmit = function(e){
        // Get Selected Product
        const selectedProduct= ProductController.getCurrentProduct()
        // Delete Product
        ProductCtrl.deleteProduct(selectedProduct);
        // Delete From UI
        UIctrl.deleteProduct();
        //get total 
        const total = ProductCtrl.getTotal();
        //delete from LS
        StorageCtrl.deleteProduct(selectedProduct);

        //add total UI
        UIctrl.addTotal(total);
        UIctrl.addState();
        if(total == 0){
            UIctrl.hideCard();
        }


        e.preventDefault();
    }


    return{
        init:function(){
            console.log("app starting...")
            UIctrl.addState();
            const products = ProductCtrl.getProducts();
            if(products.length ==0){
                UIctrl.hideCard();
            }else{
                UIctrl.createProductList(products);
            }
            loadEventListeners();
        }
    }



})(UIController,ProductController,StorageController);



App.init()



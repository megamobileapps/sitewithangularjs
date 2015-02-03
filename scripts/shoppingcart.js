function cartItem(sku, name, price, quantity, storeItemType) {
    return {
        sku:sku,
        name:name,
        price:price,
        quantity:quantity,
        storeItemType:storeItemType
    };
}
function ShoppingCart(storename) {
    this.items=[];
    this.cartName = storename;
     this.clearCart = false;
    this.checkoutParameters=[];
    
    // load items from local storage when initializing
    this.loadItems = function () {
        var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
        if (items != null && JSON != null) {
            try {
                var items = JSON.parse(items);
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.sku != null && item.name != null && item.price != null 
                        && item.quantity != null && item.storeItemType != null) {
                        item = new cartItem(item.sku, item.name, item.price, item.quantity, item.storeItemType);
                        this.items.push(item);
                    }
                }
            }
            catch (err) {
            // ignore errors while loading...
            }
        }
    }
    this.loadItems();
    // save items to local storage when unloading
    var self = this;
    $(window).unload(function () {
        if (self.clearCart) {
            self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
    });
    
    

    this.addCheckoutParameters = function(checkoutService, configParams) {
        this.checkoutParameters[checkoutService] = configParams;
    }
    
    this.getItems = function getItems() {
        return this.items;
    }
    // addItem(sku, name, price, quantity)
    
    this.saveItems = function () {
        if (localStorage != null && JSON != null) {
            localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
        }
    }
    this.addItem=function addItem(sku, name, price, quantity,storeItemType){
    
        var sFound =false;
        angular.forEach(this.items, function(data) {
           if(sku == data.sku 
              && (typeof storeItemType !== "undefined" 
               && typeof data.storeItemType !== "undefined" 
               && storeItemType == data.storeItemType)
              && sFound == false) {
               if(-10000000 == quantity) {
                   // remove this entry
                   data.quantity = 0;
               }else {
                    data.quantity += (quantity);
               }
               sFound = true;
            }
        });
        if(false == sFound) {
            var item={
                sku:sku,
                name:name,
                price:price,
                quantity:quantity
            };

            if(typeof storeItemType !== "undefined") {
                item.storeItemType = storeItemType;
            }
            this.items.push(item);
        }
        
    }
    // clearItems()
    
    this.clearItems = function clearItems() {
        this.items=[];
        this.saveItems();
    }
    //getTotalCount(sku)
    this.getTotalCount=function getTotalCount(sku) {
        var total=0;
        angular.forEach(this.items, function(data) {
            if(typeof sku === "undefined" ) {
                total += data.quantity;
            } else if(sku == data.sku) {
                total += data.quantity;
            }
        });
        return total;
                        
    }
    
    //getTotalPrice(sku)
    this.getTotalPrice=function getTotalPrice(sku) {
        var totalPrice=0;
        angular.forEach(this.items, function(data) {
            if(typeof sku === "undefined" ) {
                totalPrice += (data.quantity * data.price);
            } else if(sku == data.sku) {
                totalPrice += (data.quantity * data.price);
            }
        });
        return totalPrice;
                        
    }
    
    this.addFormFields=function addFormFields(form, data){
        //alert(typeof data);
        var keys = Object.keys(data);
        for(var i=0;i<keys.length;i++) {
            var paramName = keys[i];
            var paramValue = data[paramName];
            
            var field1 = $("<input></input>");
            $(field1).attr("type","hidden"); 
            $(field1).attr("name", paramName );
            $(field1).attr("id", paramName );
            $(field1).val(paramValue);
            
            $(form).append(field1);
        }
    };
    /*Paypal Checkout form*/
    this.checkoutPaypal = function checkoutPaypal(parms, clearCart) {

      // global data
      var data = {
        cmd: "_xclick",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8"
      };

      // item data
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_number_" + ctr] = item.sku;
        data["item_name_" + ctr] = item.name;
        data["quantity_" + ctr] = item.quantity;
        data["amount_" + ctr] = item.price.toFixed(2);
      }

      // build form
      var form = $('<form></form>');
      form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
      form.attr("method", "POST");
      form.attr("style", "display:none;");
      this.addFormFields(form, data);
      this.addFormFields(form, parms.options);
      $("body").append(form);

      // submit form
      this.clearCart = clearCart == null || clearCart;
      form.submit();
      form.remove();
    }
    
    /* facebook checkout */
    this.checkoutFacebook = function (parms, clearCart) {
        alert("Not yet implemented for facebook checkout");
    }
    
    /* global checkout */
    this.checkout = function checkout(serviceName, clearCart) {
      // select service
      if (serviceName == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
      }
      if (serviceName == null) {
        throw "Define at least one checkout service.";
      }
      var parms = this.checkoutParameters[serviceName];
      if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName + "'.";
      }

      // invoke service
      switch (parms.serviceName) {
        case "Paypal":
          this.checkoutPaypal(parms, clearCart);
          break;
        case "Facebook":
          this.checkoutFacebook(parms, clearCart);
          break;
        default:
          throw "Unknown checkout service: " + parms.serviceName;
      }
    }
    
    /* return this */
    return this;
}
let input_string = 'UK:Gloves:250:Mask: 150';





// Define inventory levels and prices
const inventory = {
  UK: {
    Masks: {
      price: 65,
      quantity: 100,
    },
    Gloves: {
      price: 100,
      quantity: 100,
    },
  },
  Germany: {
    Masks: {
      price: 100,
      quantity: 100,
    },
    Gloves: {
      price: 150,
      quantity: 50,
    },
  },
};






function get_the_order_details(input) {

    let input_info = input.split(':');
    let country,passport_number,first_item,first_item_count,second_item,second_item_count;
    
    // shipping costs and discount rates
    const shippingCostPer10Items = 400;
    const localDiscountRate = 0.2;
    
    if(input_info.length == 6){
        country = input_info[0];
        passport_number = input_info[1];
        first_item=input_info[2];
        first_item_count = input_info[3];
        second_item = input_info[4];
        second_item_count = input_info[5];
    }else{
        country = input_info[0];
        first_item=input_info[1];
        first_item_count = input_info[2];
        second_item = input_info[3];
        second_item_count = input_info[4];
    }

    let order = {
      country: country,
      passport: passport_number || '',
      items: [],
    }
    
    if(first_item == 'Gloves'){
        order.items.push({type: 'Gloves', quantity: first_item_count},{type: 'Masks', quantity: second_item_count})
    }else{
        order.items.push({type: 'Masks', quantity: first_item_count},{type: 'Gloves', quantity: second_item_count})
    }

    // If ordered quantity is greater than inventry quantity
    if(order.items[0].type == 'Gloves' && (parseInt(order.items[0].quantity) > (inventory['UK'][order.items[0].type]['quantity'] + inventory['Germany'][order.items[0].type]['quantity'])) ){
      return 'OUT_OF_STOCK'+':'+inventory['UK']['Masks']['quantity']+':'+inventory['Germany']['Masks']['quantity']+':'+inventory['UK']['Gloves']['quantity']+':'+inventory['Germany']['Gloves']['quantity'];
    }else{
      if(order.items[0].type == 'Masks' && (parseInt(order.items[0].quantity) > (inventory['UK'][order.items[0].type]['quantity'] + inventory['Germany'][order.items[0].type]['quantity']))){
        return 'OUT_OF_STOCK'+':'+inventory['UK']['Masks']['quantity']+':'+inventory['Germany']['Masks']['quantity']+':'+inventory['UK']['Gloves']['quantity']+':'+inventory['Germany']['Gloves']['quantity'];
      }
    }

    
  let totalCost = 0;
  let transportCost = 0;
   let quantity_fetched = {
       UK : {
           Masks : 0,
           Gloves : 0
       },
       Germany : {
           Masks : 0,
           Gloves : 0
        }
   }



  for (const item of order.items) {
    country = order.country;
    const itemInventory = inventory[country][item.type];
    if (item.quantity <= itemInventory.quantity) {
        totalCost += item.quantity * itemInventory.price;
        quantity_fetched[country][item.type] = parseInt(item.quantity);
    } else {
         // Fetch inventory from other country
          otherCountry = country === 'UK' ? 'Germany' : 'UK';
            
          const fetchQuantity = item.quantity - itemInventory.quantity;
        quantity_fetched[otherCountry][item.type] = parseInt(fetchQuantity);
          const fetchCost = Math.ceil(fetchQuantity / 10) * shippingCostPer10Items;
          if (order.passport.startsWith(otherCountry === 'UK' ? 'B' : 'A')) {
            // Customer gets local discount on transport cost
            transportCost += fetchCost * (1 - localDiscountRate);
          } else {
            transportCost += fetchCost;
          }
          totalCost += fetchQuantity * inventory[otherCountry][item.type].price;
          totalCost += itemInventory.quantity * itemInventory.price;
        }
  }
  return (totalCost + transportCost)+':'+(inventory['UK']['Masks']['quantity'] - quantity_fetched['UK']['Masks'] )+':'+(inventory['Germany']['Masks']['quantity'] - quantity_fetched['Germany']['Masks'])
      +':'+(inventory['UK']['Gloves']['quantity'] - quantity_fetched['UK']['Gloves'] )+':'+(inventory['Germany']['Gloves']['quantity'] - quantity_fetched['Germany']['Gloves']);
}


console.log(get_the_order_details(input_string))




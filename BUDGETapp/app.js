//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; //if it doesnt exist - value = -1!!!
    };
    
//    two functions for one task - first - calaulate and second returns it (getPercentage)
    Expense.prototype.calcPercentages = function(totalIncome){
        if (totalIncome > 0 ){
            this.percentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals: {
            exp:0,
            inc:0
        },
        budget:0,
        percentage: -1 //we set value to -1 when it's not exsisted when there is no data!
    };
    
    return {
        addItem: function(type,des,val) {
            var newItem, ID;
            
//            [0 1 2 3 4] next is 5
//            [0 3 5 8 9] next is 10
//            ID = last id + 1
            
//            create new id 
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
//            create new item based on inc or exp
            if (type === 'exp'){
                newItem = new Expense(ID,des,val);
            } else if (type === 'inc') {
                newItem = new Income(ID,des,val);
            }
            
//            push it to our datastructure
            data.allItems[type].push(newItem);
            
//            return the new element
            return newItem;
        },
        
        deleteItem: function(type, id){
            var ids, index;
//            data.allItems[type][id]; //would work if ids would be in perfect order - with no deletition!
            
//            id = 6;
//            ids = [1 2 4 6 8]
//            index  = 3
            var ids = data.allItems[type].map(function(current) {
                return current.id;    //    difference from map and foreach - map returns brand new array!            
            });
            
            index = ids.indexOf(id); //value -1 if element doesnt exists!!!
            
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            };
        },
        
        calculateBudget: function() {                  //public method!
//            calculate total input and expenses
            calculateTotal('exp');
            calculateTotal('inc');
        
//        calculate the budget income - expensees
            data.budget = data.totals.inc - data.totals.exp;
//        calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);    
            } else {
                data.percentage = -1;
            }
            
        },   
        
        calculatePercentages: function(){
          
            /*
            a = 20
            b = 30
            c = 40
            income = 100
            percentage = a/income
            */
            data.allItems.exp.forEach(function(cur){
               cur.calcPercentages(data.totals.inc);  //data / totals / inc - funkcija zgoraj!
            });
                                      
        },
        
        getPercentages:function(){
            var allPerc = data.allItems.exp.map(function(cur){ //if there would be 5 elements, function would be called 5times!!!-map!
               return cur.getPercentage(); 
            });    
            return allPerc;
        },
        
        getBudget:function(){
          return{
              budget: data.budget,
              totalInc:data.totals.inc,
              totalExp: data.totals.exp,
              percentage:data.percentage
          };
        },
        
        testing: function(){
            console.log(data);
        }
    };
    
})();

//UI CONTROLLER
var UIController = (function(){
    
    var DOMstrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBTN:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expencesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month',
    };

    var formatNumber = function(num,type){
//          +/- before number, 2 decimal, comma separating the thousands
            var numSplit;
            
            num = Math.abs(num); //we are overriting num variable!
            num = num.toFixed(2); //number prototype makes 2 decimal places - .00 if there is no decimals!
            
            numSplit = num.split('.');
            int = numSplit[0];
            if (int.length > 3){
//                int.length-3 smo uporabili, da velja za vsa števila!...če je primer 23510 ->23,510..
                int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,int.length); //it starts from 0 position and take 1 number! 2310 -> 2,310
            }
            dec = numSplit[1];
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        };
    
    //            nodeListForEach je posebej pisana funkcija, da jo lahko uporabljamo drugje
    var nodeListForEach = function(list,callback){  //in the DOM tree, all the html elements are named nodes!!! list=NODElist, ampak je krajšano
                for (var i = 0; i<list.length; i++){
                    callback(list[i], i); //list[i] = current, i = index v spodnji funkciji!!!
                }
            };
    
    return {
        getInput:function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value), //parsefloat - converts string to float!
            };
        },
    
        addListItem : function(obj, type) {
            var html, newHtml, element;
//            create html string with placeholder text
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
//            replace the placeholder text with some actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));
            
//            insert the html in to the dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        
        deleteListItem: function(selectorID){
          var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription+', '+DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array){ //spremenljivke lahko imenuješ kot želiš
                current.value = "";
            });
            fieldsArr[0].focus(); //po končanju vrne fokus na prvi element 
        },
        
        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
            
            
            if (obj.percentage > 0 ) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';    
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';    
            }
            
        },
        
        displayProcentages: function(percentages){
          
            var fields = document.querySelectorAll(DOMstrings.expencesPercLabel); //if we use queryselector - it usess only first label on the page --so we have to use ALL!!
     
            nodeListForEach(fields,function(current,index){
                
                if (percentages[index]>0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        displayMonth: function() {
            
            var now, year,month, months; 
            now = new Date();
            //var christmass = new Date(2018,11,25);
            months = ['Januar','Februar','Marec','April','Maj','Junij','Julij','Oktober','November','December']
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent =months[month] + ' ' + year;
        },
        
        changeType: function(){
          
            var fields = document.querySelectorAll(
                DOMstrings.inputType+','+
                DOMstrings.inputDescription+','+
                DOMstrings.inputValue
                );
            nodeListForEach(fields,function(cur){
               cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputBTN).classList.toggle('red');
        },

        getDomstrings: function() {
            return DOMstrings;
        }
    };
})();

//CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDomstrings();
        //enter or press ok button to work with data
        document.querySelector(DOM.inputBTN).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event){
        if (event.keyCode === 13 || event.which === 13){ /*za starejše brskalnike se uporablja wich"*/
            ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType); //spremeni obliko, ko izbereš strošek!
    }
    
    var updateBudget = function(){
        
//        calculate the budget
        budgetCtrl.calculateBudget();
//        return the budget
        var budget = budgetCtrl.getBudget();
//        display the budget
//       console.log(budget); 
        UICtrl.displayBudget(budget);
    }
    
    var updatePercentages = function(){
        
//        calculate percentages
        budgetCtrl.calculatePercentages();
//        read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
//        update the ui with the new percentages
        UICtrl.displayProcentages(percentages);
        console.log(percentages);
    };
    
    var ctrlAddItem = function(){
        var input, newItem;
        
        //        get the data
        var input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value >0 ) {
            //        add the item to the budgetController
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);

    //        add the new item to user interface
            UICtrl.addListItem(newItem, input.type);

    //        clear the field 
            UICtrl.clearFields();
                                //        calculate the budgett
            updateBudget();
            //            calculate and update percentages
            updatePercentages();


        };
//        display the budget
//        console.log("enter");
    };
    
    var ctrlDeleteItem = function (event){
        var itemId, splitId, type, ID;
        
        itemId = console.log(event.target.parentNode.parentNode.parentNode.parentNode.id); //izpiše klik na target lokacijia
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemId) {
            
//            inc-1 id moramo razdeliti na id in ime
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);
            
//            delete the item from structure
            budgetCtrl.deleteItem(type, ID);
//            delete the item from ui
            UICtrl.deleteListItem(itemId);
        //        calculate the budgett
            updateBudget();
            //            calculate and update percentages
            updatePercentages();
        }
        
    }
    
    return {
        init: function(){
            console.log("aplikacija je zagnana!");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
              budget: 0,
              totalInc:0,
              totalExp: 0,
              percentage: 0
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();

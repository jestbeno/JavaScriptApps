function insert(num){
    document.form.textview.value = document.form.textview.value+num;
}

function equal(){
    var exp=document.form.textview.value;
    if(exp){
        document.form.textview.value=eval(exp);
    }
}

function cleared(){
    document.form.textview.value="";
}
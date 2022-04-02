 // doi tuong Validator
 function Validator(options) {


     var selectorRules = {};

     // hàm thực hiện validate
     function validate(inputElement, rule){
              var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
              var errorMessage ; 
              
              // lay qua cac rules cua selector
              var rules = selectorRules[rule.selector];

              //lap qua tung rule & kiem tra(check)
              for(var i = 0 ;i < rules.length; ++i ){
                errorMessage = rules[i](inputElement.value); 
                if(errorMessage) break;
              }

              if(errorMessage){
                  errorElement.innerText = errorMessage;
                  inputElement.parentElement.classList.add('invalid');
              }else{
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
              }
              return !errorMessage;
     }
     
     // lấy element của form cần validate

     var formElement = document.querySelector(options.form); 
     if (formElement) {

        formElement.onsubmit = function (e){
          e.preventDefault();

          var isFormValid = true;



          // lap qua tung rule va validate
          options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector);
            var isValid = validate(inputElement, rule);
            if(!isValid){
              isFormValid = false;
            }
          });


          if(isFormValid){
             if(typeof options.onSubmit === 'function'){

                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');

                var formValues = Array.from(enableInputs).reduce(function(values , input){
                  return (values[input.name] = input.value) && values;
                }, {}); 

               options.onSubmit(formValues);
             }
          }
        }
         // lap qua moi rule va xu ly(lang nghe su kien blur , input)
        options.rules.forEach(function(rule) {

          // Lưu lại các rules cho mỗi input
          if (Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test)
          }else{
            selectorRules[rule.selector] = [rule.test];
          }

          var inputElement = formElement.querySelector(rule.selector);

          if(inputElement){
            // xử lí trường hợp blur ra khỏi input
            inputElement.onblur = function(){
              validate(inputElement, rule);
           }

           // xử lý mỗi khi người dùng nhập vào input
            inputElement.oninput = function(){
               var errorElement = inputElement.parentElement.querySelector('.form-message');
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }
         }

       });

    }

}

// dinh nghia rules
// nguyen tac cua cac rules:
// 1. khi co loi => thi tra ra messae loi
// 2. khi hop le => thi  k tra ra cai gi ca
Validator.isRequired = function(selector ,message){
  return {
    selector: selector,
    test: function(value){
      return value.trim() ? undefined : message || 'Vui lòng nhập lại'
    }
  };
}

Validator.isEmail = function(selector ,message){
  return {
    selector: selector,
    test: function(value){
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || 'vui lòng nhập email';
    }
  };
}

Validator.minLength = function(selector ,min ,message){
  return {
    selector: selector,
    test: function(value){
 
      return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự `;

    }
  };
}

Validator.isConfirmed = function (selector, getCofirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
          return value === getCofirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
    }
  }
}
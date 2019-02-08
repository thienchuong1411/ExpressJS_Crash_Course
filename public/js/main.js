$(document).ready(function(){
    $('.deleteUser').on('click', deleteUser)    // sử kiện click sẽ gọi function deleteUser
});

function deleteUser(){
    //alert(1)
    var confirmation = confirm('Are you sure?');

    if (confirmation) {
        //alert(1);
        // let id = $('.deleteUser').data('id');   alert(id);
        // cách dùng let ở trên sẽ sai, do id lấy được dựa vào class .deleteUser nên lúc nào nó cũng lấy cái id đầu tiên dù mình nhấn vào các contact khác
        // vì vậy phải thay thế $('.deleteUser').data('id') nằmg $(this).data('id')
        let id = $(this).data('id'); //alert(id);
        
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/' + id
        }).done(function(response){
            // window.location.replace('/');
        });

        window.location.replace('/');   // reload page to show result
    } else {
        return false;
    }
}
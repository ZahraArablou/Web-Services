const DOMAIN = "http://localhost:3000";


function getAndDisplayAllbookes() {
    refreshBookList();
}
//**********************delete item**********************************
function DeleteItem(id){
    if (!confirm("Are you sure you want to delete this item?")) return;
    $.ajax({
        method: "Delete",
        url: `${DOMAIN}/books/${id}`
    }).done((resp) => {
        alert("Deleted successfully: " + resp);
        refreshBookList();
    }).fail((xhrObj, textStatus) => {
        // API sends an error . Response code in 400s or 500s
        if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
            alert(xhrObj.responseJSON.message);
    });
}
//******************** find Item for  Edit***********************

function EditItem(id){
   // $("#waitForIt").show();

    $.ajax({
        method: "Get",
        url: `${DOMAIN}/books/${id}`
       
    }).done((resp) => {
        var result="<br><br>";
        resp.forEach(book => {
        result += "<br><br> Name <input type='text' name='name' value='"+ book.name + "'>";
        result += "Author<input type='text' name='author' value='"+ book.author + "'>";
        result += "Publish<input type='text' name='publish' value='"+ book.publish + "'>";
        result += "Publish Date<input style='height:50px;margin-bottom:10px;' type='date' class='form-control' name='pubDate' value='"+ book.pubDate + "'>";
        result += "Price<input  type='text' name='price' value="+ book.price + ">";
        result += "Quantity <input type='text' name='quantity' value="+ book.quantity + ">";
        result +="<button class='btn btn-primary' style='margin-right:15px;width:100px;' id='save' onclick='editBook("+ book.id + ")'>Save </button><button class='btn btn-primary' style='width:100px;' id='cancel'  onclick='cancelEdit()'>Cancel </button>";
        
        });
        $("#listTable").hide();
        $("#viewEditPane").show();
        $("#viewEditPane").html(result);
}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}
//**********************Edit Book **************************** */
function editBook(id){
    var bname=$("input[name=name]").val();
    var bauthor=$("input[name=author]").val();
    var bpublish=$("input[name=publish]").val();
    var bpubDate= ($("input[name=pubDate]").val());
    var bprice=parseInt($("input[name=price]").val());
    var bquantity=parseInt($("input[name=quantity]").val());
    var bookObj = { name: bname, author: bauthor, publish: bpublish ,pubDate: bpubDate, price: bprice, quantity:bquantity};
    var jsonString = JSON.stringify(bookObj);
    //alert(jsonString);
    $.ajax({
        method: "put",
        url: `${DOMAIN}/books/${id}`,
        dataType: "json",
        data: bookObj, // body of the request
    }).done((resp) => {
      alert("Record successfully updated!");
      $("#viewEditPane").hide();

    }).fail((xhrObj, textStatus) => {
        // API sends an error . Response code in 400s or 500s
        if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
            alert(xhrObj.responseJSON.message);
    });
}
//cancel edit
function cancelEdit(){
    $("#viewEditPane").hide();

}

//***************************** refresh all books list ************************************
function refreshBookList(){
    $.ajax({
        method: "GET",
        url: `${DOMAIN}/books`
    }).done((resp) => {
        $("#bname").val("");
  printBookList(resp);

}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}
//********** */
function printBookList(resp){
    
    var result = '<tr><th>#</th>'
    + '<th>Name</th>'
    + '<th>Author</th>'
    + '<th>Published by</th>'
    + '<th>Publish Date</th>'
    + '<th>Price</th>'
    + '<th>Quantity</th>'
    + '<th>Edit</th>'
    + '<th>Delete</th>'
    +'</tr>'+ '\n' 
   ;
   resp.forEach(book => {
        result +=  '<tr>';
        result += '<td>' + book.id + '</td>';
        result += '<td>' + book.name + '</td>';
        result += '<td>' + book.author + '</td>'; // FIXME: html encode to entities ?
        result += '<td>' + book.publish + '</td>';
        result += '<td>' + book.pubDate + '</td>';
        result += '<td>' + book.price + '</td>';

        result += '<td>' + book.quantity + '</td>';
        result += '<td><button onclick="EditItem('+book.id+')"> Edit</button></td>';
        result += '<td><button onclick="DeleteItem('+book.id+')"> Delete</button></td>';
      
        result += '</tr>' + "\n";  
   });
   $("#listTable").show();
   $("#viewEditPane").hide();

   $("#listTable").html(result);
   
}
//***************************** Get By Name*****************************/
function getbooksByName()
{
   var bname=$("#bname").val();
  // alert(bname);
   $.ajax({
    method: "GET",
    url: `${DOMAIN}/books/book/${bname}`
}).done((resp) => {
    //alert(resp);
//$("#listTable").hide();
printBookList(resp);

}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}

//*********************Add New Book Form Design******************** */
function addNewBook(){
    $("#bname").val("");
    var result="<br><br>";
    result+='<form><div class="mb-3">';
    result+='<br><label style="color: black;" for="name" class="form-label">Name</label>';
    result+='<input type="text" class="form-control" name="name" >';
    result+='<label style="color: black;" for="author" class="form-label">Author</label>';
    result+='<input type="text" class="form-control" name="author" >';
    result+='<label style="color: black;" for="publish" class="form-label">Publish</label>';
    result+='<input type="text" class="form-control" name="publish" >';
    result+='<label style="color: black;"for="pubDate" class="form-label">Publish Date</label>';
    result+='<input type="date" class="form-control" name="pubDate">';
    result+='<label style="color: black;"for="price" class="form-label">Price</label>';
    result+='<input type="text" class="form-control" name="price">';
    result+='<label style="color: black;"for="quantity" class="form-label">Quantity</label>';
    result+='<input type="text" class="form-control" name="quantity"><br>';
    result+= '<button onclick="AddBook()"  style="width:150px;margin-right:15px;" class="btn btn-primary">Submit</button><button class="btn btn-primary" style="width:150px;" id="cancel"  onclick="cancelEdit()">Cancel </button>';
    result+='</form>"';
$("#listTable").hide();

     $("#viewEditPane").show();
     $("#viewEditPane").html(result);
}

//********* Add new book******* */
function AddBook(){

 var bname=$("input[name=name]").val();
    var bauthor=$("input[name=author]").val();
    var bpublish=$("input[name=publish]").val();
    var bpubDate= ($("input[name=pubDate]").val());
    var bprice=parseInt($("input[name=price]").val());
    var bquantity=parseInt($("input[name=quantity]").val());
  //if fiels are empty
    if(bname===""||bauthor===""||bpubDate===""|| $("input[name=price]").val()===""||$("input[name=quantity]").val()===""){
        // alert("fields cannot be null");
    var result="<br><br>";
    result+='<form><div class="mb-3">';
    result+='<br><label style="color: black;" for="name" class="form-label" >Name</label>';
    result+='<input type="text" class="form-control" name="name" value="'+ bname + '" >';
    result+='<label style="color: black;" for="author" class="form-label"  >Author</label>';
    result+='<input type="text" class="form-control" name="author" value="'+ bauthor + '">';
    result+='<label style="color: black;" for="publish" class="form-label">Publish</label>';
    result+='<input type="text" class="form-control" name="publish" value="'+ bpublish + '" >' ;
    result+='<label style="color: black;"for="pubDate" class="form-label">Publish Date</label>';
    result+='<input type="date" class="form-control" name="pubDate"value="'+ bpubDate + '" >';
    result+='<label style="color: black;"for="price" class="form-label">Price</label>';
    result+='<input type="text" class="form-control" name="price" value="'+ bprice + '" >';
    result+='<label style="color: black;"for="quantity" class="form-label">Quantity</label>';
    result+='<input type="text" class="form-control" name="quantity" value="'+ bquantity + '"><br>';
    result+= '<button onclick="AddBook()"  style="width:150px;margin-right:15px;" class="btn btn-primary">Submit</button><button class="btn btn-primary" style="width:150px;" id="cancel"  onclick="cancelEdit()">Cancel </button>';
    result+='</form>"';
    $("#listTable").hide();
    $("#viewEditPane").show();
    $("#viewEditPane").html(result);
}
    var bookObj = { name: bname, author: bauthor, publish: bpublish ,pubDate: bpubDate, price: bprice, quantity:bquantity};
     var jsonString = JSON.stringify(bookObj);
    //alert(jsonString);
    $.ajax({
        method: "post",
        url: `${DOMAIN}/books`,
        dataType: "json",
        data: bookObj, // body of the request
    }).done((resp) => {
      alert("Record successfully added!");

    }).fail((xhrObj, textStatus) => {
        // API sends an error . Response code in 400s or 500s
        if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
            alert(xhrObj.responseJSON.message);
    });
}



const DOMAIN = "http://localhost:3000";
var memberId=0;
//****************search members by id */
function getmembersById(){
    var id=$("input[name=memberId]").val();
    memberId=id;
         $.ajax({
            method: "GET",
            url: `${DOMAIN}/members/${id}`
        }).done((resp) => {
            // if(resp.value===undefined)
            // alert("there is no student with this id");
            // else{
 
            var memberFound=false;
            resp.forEach(member => {
           
                document.getElementById("info").style.visibility = 'visible';
                document.getElementById("bookSearch").style.visibility = 'visible';
                $("#name").val(member.name);
                $("#email").val(member.email);
                 memberFound=true;
            });
            if(memberFound){
            refreshBookList();   
            }else{
                alert("There is no member with this Id");
                $("#listTable").hide();
                document.getElementById("info").style.visibility = 'hidden';
                document.getElementById("bookSearch").style.visibility = 'hidden';
            }
        
    }).fail((xhrObj, textStatus) => {
        // API sends an error . Response code in 400s or 500s
        if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
            alert(xhrObj.responseJSON.message);
    });
}
//*************************search books***************************** */
function getbooks(){
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

function printBookList(resp){
    
    var result = '<tr><th>#</th>'
    + '<th>Name</th>'
    + '<th>Author</th>'
    + '<th>Published by</th>'
    + '<th>Publish Date</th>'
    + '<th>Price</th>'
    + '<th>Quantity</th>'
    
    + '<th>Select</th>'
    +'</tr>'+ '\n' 
   ;
   resp.forEach(book => {
     
        result +=  '<tr>';
        result += '<td>' + book.id + '</td>';
        result += '<td>' + book.name + '</td>';
        result += '<td>' + book.author + '</td>'; 
        result += '<td>' + book.publish + '</td>';
        result += '<td>' + book.pubDate + '</td>';
        result += '<td>' + book.price + '</td>';

        result += '<td>' + book.quantity + '</td>';
        result+="<td><button class='btn btn-primary' style='margin-right:15px;width:100px;' id='save' onclick='selectBook("+ book.id +"," +book.quantity + ")'>select </button></td>";
      
        result += '</tr>' + "\n";  
   });
   $("#listTable").show();
   $("#viewEditPane").hide();

   $("#listTable").html(result);
   
}
//*************get all books list************************ */
function getAndDisplayAllbookes() {
    refreshBookList();
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
//***********************select book to Issue ************ */
function selectBook(bookid,qty){
   if(qty<1){
       alert("This book is not available(qty=0)");
       return;
   }
    if (!confirm("Are you sure you want to Issue book id "+bookid)) return;


//***********Add Issued Book ************************/
var issueObj = { memberId: memberId, bookId: bookid};
$.ajax({
    method: "post",
    url: `${DOMAIN}/borrows`,
    dataType: "json",
    data: issueObj, // body of the request
}).done((resp) => {
  alert("Book successfully Issued!");
  
  //decrease the qty of book
  $.ajax({
    method: "patch",
    url: `${DOMAIN}/books/${bookid}/${qty-1}`
    
}).done((resp) => {

});
 
}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}
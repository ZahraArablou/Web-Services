const DOMAIN = "http://localhost:3000";
var memberId=0;
//****************search members by id */
function getmembersById(){
    var id=$("input[name=memberId]").val();
    memberId=id;
         $.ajax({
            method: "GET",
            url: `${DOMAIN}/members/${memberId}`
        }).done((resp) => {
            document.getElementById("info").style.visibility = 'visible';
            var memberFound=false;
            resp.forEach(member => {
           
                  $("#name").val(member.name);
                  $("#email").val(member.email);
                  memberFound=true;
            });
            if(memberFound){
            getBorrowedbookList(id);
            }else{
                alert("There is no member with this Id");
                $("#listTable").hide();
                document.getElementById("info").style.visibility = 'hidden';
               // document.getElementById("bookSearch").style.visibility = 'hidden';
            }
        
    }).fail((xhrObj, textStatus) => {
        // API sends an error . Response code in 400s or 500s
        if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
            alert(xhrObj.responseJSON.message);
    });
}
function getBorrowedbookList(id){
    var bname=$("#bname").val();
    
     $.ajax({
      method: "GET",
      url: `${DOMAIN}/borrows/book/${id}`
  }).done((resp) => {
   
  //$("#listTable").hide();
  printBookList(resp);
  }).fail((xhrObj, textStatus) => {
      // API sends an error . Response code in 400s or 500s
      if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
          alert(xhrObj.responseJSON.message);
  });
}

function printBookList(resp){
     var result = '<tr><th>Name</th>'
    + '<th>Author</th>'
    + '<th>Issue Date</th>'
    + '<th>Return Date</th>'
    + '<th>Return</th>'
    +'</tr>'+ '\n' 
   ;
   resp.forEach(book => {
        result +=  '<tr>';
        result += '<td>' + book.name + '</td>';
        result += '<td>' + book.author + '</td>'; 
        result += '<td>' + book.issueDate + '</td>';
        result += '<td>' + book.returnDate + '</td>';
        result+="<td><button class='btn btn-primary' style='margin-right:15px;width:100px;' id='return' onclick='returnBook("+ book.borrowId+","+ book.id +"," + book.quantity + ")'>Return </button></td>";
        result += '</tr>' + "\n";  
   });
   $("#listTable").show();
   $("#viewEditPane").hide();
   $("#listTable").html(result);
}
//******************return book/ change return Date /add book quantity / refresh the list********* */
function returnBook(borrowId,bookId,qty){
  var date="2010-01-02";
  var date=new Date();
  var now=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
// update the returnDate to current date
  $.ajax({
    method: "patch",
    url: `${DOMAIN}/borrows/${borrowId}/${now}`
    
}).done((resp) => {
alert("done! Thank you!");
//refresh the list
getBorrowedbookList(memberId);
 //increase the qty of book
 $.ajax({
    method: "patch",
    url: `${DOMAIN}/books/${bookId}/${qty+1}`
 }).done((resp) => {
}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}
        
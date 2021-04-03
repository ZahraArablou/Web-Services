const DOMAIN = "http://localhost:3000";

function getAndDisplayAllbookes() {
    document.getElementById("search").style.visibility = 'hidden';
    document.getElementById("info").style.visibility = 'hidden';
    refreshBookList();
}
//*************/
function refreshBookList(){
    $.ajax({
        method: "GET",
        url: `${DOMAIN}/borrows/borrowedbook`
    }).done((resp) => {
        printBookList1(resp);

}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}
//***********/
function printBookList1(resp){
    var result = '<tr><th>Book Name</th>'
     + '<th>Author</th>'
    + '<th>Member name </th>'
    + '<th>Issue Date</th>'
    +'</tr>'+ '\n' 
   ;
   resp.forEach(book => {
        result +=  '<tr>';
        result += '<td>' + book.bookName + '</td>'; 
        result += '<td>' + book.author + '</td>';
        result += '<td>' + book.memberName + '</td>';
        result += '<td>' + book.issueDate + '</td>';
        result += '</tr>' + "\n";  
   });
   $("#listTable").show();
   $("#viewEditPane").hide();
   $("#listTable").html(result);
}

//******************Member History**************/
function memberHistory(){
    document.getElementById("search").style.visibility = 'visible';
    $("#listTable").hide();
    
}
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
    // alert(bname);
     $.ajax({
      method: "GET",
      url: `${DOMAIN}/borrows/history/${id}`
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
    var result = '<tr><th>Book Name</th>'
    + '<th>Author</th>'
    + '<th>Issue Date</th>'
    + '<th>Return Date</th>'
     +'</tr>'+ '\n' 
   ;
   resp.forEach(book => {
        result +=  '<tr>';
        result += '<td>' + book.name + '</td>';
        result += '<td>' + book.author + '</td>'; 
        result += '<td>' + book.issueDate + '</td>';
        result += '<td>' + book.returnDate + '</td>';
         result += '</tr>' + "\n";  
   });
   $("#listTable").show();
   $("#viewEditPane").hide();
   $("#listTable").html(result);
}
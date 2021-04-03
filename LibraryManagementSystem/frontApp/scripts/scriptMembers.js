const DOMAIN = "http://localhost:3000";


function getAndDisplayAllmembers() {
    refreshBookList();
}
//**********************delete item**********************************
function DeleteItem(id){
    if (!confirm("Are you sure you want to delete this item?")) return;
    $.ajax({
        method: "Delete",
        url: `${DOMAIN}/members/${id}`
    }).done((resp) => {
        alert(resp);
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
        url: `${DOMAIN}/members/${id}`
       
    }).done((resp) => {
        var result="<br><br>";
        resp.forEach(member => {
        result += "Author<input type='text' name='name' value='"+ member.name + "'>";
        result += "Publish<input type='text' name='phone' value='"+ member.phone + "'>";
        result += "Price<input  type='text' name='email' value="+ member.email + ">";
        result += "Quantity <input type='text' name='address' value="+ member.address + ">";
        result +="<button class='btn btn-primary' style='margin-right:15px;width:100px;' id='save' onclick='editBook("+ member.id + ")'>Save </button><button class='btn btn-primary' style='width:100px;' id='cancel'  onclick='cancelEdit()'>Cancel </button>";
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
    var bphone=$("input[name=phone]").val();
    var bemail=$("input[name=email]").val();
    var baddress= $("input[name=address]").val();
    var memberObj = { name: bname, phone: bphone, email: bemail ,address: baddress};
    //alert(jsonString);
    $.ajax({
        method: "put",
        url: `${DOMAIN}/members/${id}`,
        data: memberObj, // body of the request
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

//***************************** refresh all members list ************************************
function refreshBookList(){
    $.ajax({
        method: "GET",
        url: `${DOMAIN}/members`
    }).done((resp) => {
        $("#bname").val("");
  printMemberList(resp);

}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}
//********** */
function printMemberList(resp){
    
    var result = '<tr><th>#</th>'
    + '<th>Name</th>'
    + '<th>Phone</th>'
    + '<th>Email</th>'
    + '<th>Address</th>'
    + '<th>Edit</th>'
    + '<th>Delete</th>'
    +'</tr>'+ '\n' 
   ;
   resp.forEach(member => {
        result +=  '<tr>';
        result += '<td>' + member.id + '</td>';
        result += '<td>' + member.name + '</td>';
        result += '<td>' + member.phone + '</td>'; // FIXME: html encode to entities ?
        result += '<td>' + member.email + '</td>';
        result += '<td>' + member.address + '</td>';
        result += '<td><button onclick="EditItem('+member.id+')"> Edit</button></td>';
        result += '<td><button onclick="DeleteItem('+member.id+')"> Delete</button></td>';
      
        result += '</tr>' + "\n";  
   });
   $("#listTable").show();
   $("#viewEditPane").hide();

   $("#listTable").html(result);
   
}
//***************************** Get By Name*****************************/
function getmembersByName()
{
   var bname=$("#bname").val();
  // alert(bname);
   $.ajax({
    method: "GET",
    url: `${DOMAIN}/members/member/${bname}`
}).done((resp) => {
    //alert(resp);
//$("#listTable").hide();
printMemberList(resp);

}).fail((xhrObj, textStatus) => {
    // API sends an error . Response code in 400s or 500s
    if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
        alert(xhrObj.responseJSON.message);
});
}

//*********************Add New Member Form Design******************** */
function addNewMember(){
    $("#bname").val("");
    var result="<br><br>";
    result+='<form><div class="mb-3">';
    result+='<br><label style="color: black;" for="name" class="form-label">Name</label>';
    result+='<input type="text" class="form-control" name="name" >';
    result+='<label style="color: black;" for="phone" class="form-label">Phone</label>';
    result+='<input type="text" class="form-control" name="phone" >';
    result+='<label style="color: black;" for="email" class="form-label">Email</label>';
    result+='<input type="text" class="form-control" name="email" >';
    result+='<label style="color: black;"for="address" class="form-label">Address</label>';
    result+='<input type="text" class="form-control" name="address">';
    result+= '<button onclick="AddMember()"  style="width:150px;margin-right:15px;" class="btn btn-primary">Submit</button><button class="btn btn-primary" style="width:150px;" id="cancel"  onclick="cancelEdit()">Cancel </button>';
    result+='</form>"';
$("#listTable").hide();

     $("#viewEditPane").show();
     $("#viewEditPane").html(result);
}

//********* Add new member******* */
function AddMember(){

    var bname=$("input[name=name]").val();
    var bphone=$("input[name=phone]").val();
    var bemail=$("input[name=email]").val();
    var baddress= $("input[name=address]").val();
   
  //if fiels are empty
    if(bname===""||bphone===""||bemail===""||bphone===""||baddress===""){
        // alert("fields cannot be null");
    var result="<br><br>";
    result+='<form><div class="mb-3">';
    result+='<br><label style="color: black;" for="name" class="form-label" >Name</label>';
    result+='<input type="text" class="form-control" name="name" value="'+ bname + '" >';
    result+='<label style="color: black;" for="phone" class="form-label"  >Phone</label>';
    result+='<input type="text" class="form-control" name="phone" value="'+ bphone + '">';
    result+='<label style="color: black;" for="email" class="form-label">Email</label>';
    result+='<input type="text" class="form-control" name="email" value="'+ bemail + '" >' ;
     result+='<label style="color: black;"for="address" class="form-label">Address</label>';
    result+='<input type="text" class="form-control" name="address" value="'+ baddress + '" >';
    result+= '<button onclick="AddMember()"  style="width:150px;margin-right:15px;" class="btn btn-primary">Submit</button><button class="btn btn-primary" style="width:150px;" id="cancel"  onclick="cancelEdit()">Cancel </button>';
    result+='</form>"';
    $("#listTable").hide();
    $("#viewEditPane").show();
    $("#viewEditPane").html(result);
}
var memberObj = { name: bname, phone: bphone, email: bemail ,address: baddress};
     var jsonString = JSON.stringify(memberObj);
    //alert(jsonString);
    $.ajax({
        method: "post",
        url: `${DOMAIN}/members`,
        dataType: "json",
        data: memberObj, // body of the request
    }).done((resp) => {
      alert("Record successfully added!");

    }).fail((xhrObj, textStatus) => {
        // API sends an error . Response code in 400s or 500s
        if (xhrObj && xhrObj.responseJSON && xhrObj.responseJSON.message)
            alert(xhrObj.responseJSON.message);
    });
}

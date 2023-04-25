$('#lastcomment').hide();
document.getElementById("loadingbtn").addEventListener("click",function(event){
    const length=document.getElementById("commentslist").childNodes.length;
    var commentsnum=0;
    for(var i=0;i<length;i++)
    {
        const name=document.getElementById("commentslist").childNodes[i].className;
        if(name=='listnode')
            commentsnum++;
    }
    $.ajax({
        url:'/commenttest/getmore/'+commentsnum,
        method:'Get',
        success: function(response) {
            console.log(response);
            if(response.length==0)
            {
                $('#lastcomment').show();
            }
            else
            {
                for(var i=0;i<response.length;i++)
                {
                    const newli=document.createElement('li');
                    newli.setAttribute('class','listnode');
                    newli.innerHTML=response[i];
                    document.getElementById("commentslist").append(newli);
                }
            }
          },
        error: function(xhr, status, error) {
            console.log(error);
          }
    })
})

document.getElementById("commentForm").addEventListener("submit",function(event){
    event.preventDefault();

    var form = new FormData(this);
    var obj = document.getElementById("select-img");
    length = obj.files.length;
    console.log(length);
    form.delete("pic");
    for(var i in obj.files)
    {
        form.append("pic"+i,obj.files[i]);
    }
    $.ajax({
    url: '/commenttest/test',
    method: 'POST',
    processData: false,
    contentType: false,
    data: form,
    success: function(response) {
        //console.log(form);
        console.log(response);
        const thisform=document.getElementById("commentForm");
        thisform.reset();
        document.getElementById('pics').innerHTML='';
        const newli=document.createElement('li');
        newli.setAttribute('class','listnode');
        newli.innerHTML=response;
        document.getElementById("commentslist").insertAdjacentElement("afterbegin",newli);
    },
    error: function(xhr, status, error) {
        console.log('Error: ' + error.message);
    }
    });
})

document.getElementById("select-img").addEventListener("change",function(){
    const selector=this;
    for(var i=0;i<selector.files.length;i++)
    {
        //console.log(selector.files[i]);
        var reader = new FileReader();
        if(!reader){
            console.log("your browser doesn't support FileReader");
            return;
        }
        reader.error=(e)=>{
            console.log("load error");
        }
        //IFFE
        ;(function(i){
        reader.onload=(e)=>{
            var divItem=document.createElement('div');
            divItem.setAttribute('class','picitem');
            var divPic=document.createElement('div');
            divPic.setAttribute('class','picbox');
            var img=document.createElement('img');
            img.setAttribute('class','img');
            img.setAttribute('src',e.target.result);
            var divTk=document.createElement('div');
            divTk.setAttribute('class','tk');
            var spanDel=document.createElement('span');
            spanDel.setAttribute('class','del');
            console.log(selector.files[i]);
            spanDel.setAttribute('id',selector.files[i].name)
            spanDel.innerText='x';
            divPic.appendChild(img);
            divItem.appendChild(divPic);
            divItem.appendChild(divTk);
            divItem.appendChild(spanDel);
            var pics=document.getElementById('pics');
            pics.appendChild(divItem);
            spanDel.onclick=()=>{
                var itemNode = spanDel.parentNode,
                imgid = spanDel.getAttribute('id');
                var flag = confirm("Do you want to delete image："+imgid+"?");
                if(flag) {
                    itemNode.parentNode.removeChild(itemNode);
                    console.log('delete successfully!')
                }
            }
        }
    })(i)
        reader.onloadstart=()=>{
        }
        reader.onprogress=(e)=>{
            if(e.lengthComputable){
                console.log("reading file")
            }
        }
        reader.readAsDataURL(this.files[i]);
    }
})




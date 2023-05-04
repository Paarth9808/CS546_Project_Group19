$('#lastcomment').hide();


var allfiles={};

function adderrorsolution(element)
{
    const images = element.querySelectorAll('.profile');
    for(var i=0;i<images.length;i++)
    {
        const img=images[i]
        img.addEventListener('error', function() {
        img.src = '/public/userimages/default.jpg';
        });
    }
}

adderrorsolution(document)

function addlistener(element)
{
    const attitudes=element.querySelectorAll(".attitude");
    console.log(attitudes.length);
    for(var i=0;i<attitudes.length;i++)
    {
        const attitude=attitudes[i];
        const selection=attitude.querySelectorAll("*");
        for(var j=0;j<selection.length;j++)
        {
            const temp=selection[j];
            const like=selection[0];
            const dislike=selection[1];
            const report=selection[2];
            selection[j].addEventListener("click",function(event){
                console.log(temp);
                const id=temp.getAttribute("id");
                const att=temp.getAttribute("class");
                if(att=="reportlabel")
                {
                    var flag = confirm("Are you sure to report this comment?");
                    if(!flag) {
                        return;
                    }
                }
                $.ajax({
                    url:'/comment/sendattitude/',
                    method:'Post',
                    data:{id:id},
                    success: function(response) {
                        //console.log(form);
                        //console.log(response);
                        if(response.data!=undefined&&response.data.like!=undefined&&response.data.dislike!=undefined&&response.data.report!=undefined)
                        {
                            like.innerHTML="like "+response.data.like;
                            dislike.innerHTML="dislike "+response.data.dislike;
                            report.innerHTML="report "+response.data.report;
                        }
                        else if(response.data=="deleted")
                        {
                            attitude.parentNode.parentNode.parentNode.style.display="none";
                        }
                        else if(response.data=="nologin")
                        {
                            alert("You didn't login");
                        }
                        else if(response.data==-1)
                        {
                            alert("You have reported this comment, don't do again.");
                        }
                        else
                        {
                            console.log(response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.log(error);
                    }
                })
            })
        }
    }
}

addlistener(document);

const reportbtn=document.getElementById("checkreported");
var checked=false;
if(reportbtn)
{
    reportbtn.addEventListener("click",function(event){
        const gameid=document.getElementById("loadingbtn").getAttribute("class");
        $('#loadingbtn').hide()
        if(!checked)
        {
            reportbtn.innerHTML="Complete";
            checked=true;
            document.getElementById("commentslist").innerHTML="";
            $.ajax({
                url:'/comment/getreported/'+gameid,
                //url:'/comment/getmore/'+commentsnum,
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
                            addlistener(newli);
                            adderrorsolution(newli);
                            document.getElementById("commentslist").append(newli);
                        }
                    }
                  },
                error: function(xhr, status, error) {
                    console.log(error);
                  }
            })
        }
        else
        {
            reportbtn.innerHTML="Check reported comments";
            checked=false;
            location.reload();
        }
    })
}


document.getElementById("loadingbtn").addEventListener("click",function(event){
    const length=document.getElementById("commentslist").childNodes.length;
    const gameid=document.getElementById("loadingbtn").getAttribute("class");
    var commentsnum=0;
    for(var i=0;i<length;i++)
    {
        const name=document.getElementById("commentslist").childNodes[i].className;
        if(name=='listnode')
            commentsnum++;
    }
    $.ajax({
        url:'/comment/getmore/'+gameid+'/'+commentsnum,
        //url:'/comment/getmore/'+commentsnum,
        method:'Get',
        success: function(response) {
            console.log(response);
            if(response=="nologin")
            {
                alert("You didn't login");
                return;
            }
            else if(response.length==0)
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
                    addlistener(newli);
                    adderrorsolution(newli);
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
    if(checked)
    {
        alert("Dear Admin, please complete the reported comments checking first");
        return;
    }
    const gameid=document.getElementById("commentForm").getAttribute("class");
    var form = new FormData(this);
    //var obj = document.getElementById("select-img");
    //length = obj.files.length;
    console.log(allfiles)
    for(var i in allfiles)
    {
        form.append("pic"+i,allfiles[i]);
    }
    allfiles={};
    form.append("gameid",gameid);
    for (const [key, value] of form.entries()) {
        console.log(key, value);
        console.log(value.name);
      }
    $.ajax({
    url: '/comment/sendcomment',
    //url:'/commenttest/test',
    method: 'POST',
    processData: false,
    contentType: false,
    data: form,
    success: function(response) {
        if(response=="nologin")
        {
            alert("You didn't login");
        }
        else
        {
            console.log(response);
            const thisform=document.getElementById("commentForm");
            thisform.reset();
            document.getElementById('pics').innerHTML='';
            const newli=document.createElement('li');
            newli.setAttribute('class','listnode');
            newli.innerHTML=response;
            addlistener(newli);
            adderrorsolution(newli);
            document.getElementById("commentslist").insertAdjacentElement("afterbegin",newli);
        }
    },
    error: function(xhr, status, error) {
        console.log('Error: ' + error.message);
    }
    });
})

var index=0;
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
            allfiles[index]=selector.files[i];
            var divItem=document.createElement('div');
            divItem.setAttribute('class','picitem');
            var divPic=document.createElement('div');
            divPic.setAttribute('class','picbox');
            var img=document.createElement('img');
            img.setAttribute('class','img');
            img.setAttribute('src',e.target.result);
            var divTk=document.createElement('div');
            divTk.setAttribute('class','tk');
            divTk.innerHTML = selector.files[i].name;
            var spanDel=document.createElement('span');
            spanDel.setAttribute('class','del');
            console.log(selector.files[i]);
            spanDel.setAttribute('id',index++);
            spanDel.innerText='x';
            divPic.appendChild(img);
            divItem.appendChild(divPic);
            divItem.appendChild(divTk);
            divItem.appendChild(spanDel);
            var pics=document.getElementById('pics');
            pics.appendChild(divItem);
            spanDel.onclick=()=>{
                var itemNode = spanDel.parentNode;
                const itemindex  = spanDel.getAttribute('id');
                var flag = confirm("Do you want to delete this image?");
                if(flag) {
                    delete allfiles[itemindex];
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
                //console.log("reading file")
            }
        }
        reader.readAsDataURL(this.files[i]);
    }
})




function adderrorsolution(element)
{
    const img = element.getElementById("userprofile");
    img.addEventListener('error', function() {
    img.src = '/public/userimages/default.png';
    });
}

adderrorsolution(document);
$('.select-img').fileupload({
    success: function (data) {
    	// 图片预览操作
        $('.show-img').attr('src', data.picAddr);
    }
});


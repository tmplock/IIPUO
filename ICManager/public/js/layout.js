$(document).ready(
	function() {
	$("li.btn_sub > a").click(
		function() {
			var submenu = $(this).next(".sub_menu");
			if (submenu.is(":visible")) {
				submenu.slideUp();
			} else {
				submenu.slideDown();
			}
		});
	$( "li.btn_sub > a" ).click(function() {
		$( this ).toggleClass( "skin_bg");
	});
});
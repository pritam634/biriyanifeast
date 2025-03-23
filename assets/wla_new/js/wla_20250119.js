var readSMS = 0;
var pwa = 'web';
var tryCount = 0;
var uagent = navigator.userAgent;
var domain = window.location.hostname;
var testing = 0;
var truecallerRequestId = '';
var pollingCount = 0;
var cMappingId;
var origin = window.location.origin;
document.addEventListener("DOMContentLoaded", function() {
    let today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    document.getElementById("DateOfBirth").setAttribute("max", today);
    document.getElementById("AniversaryLabel").setAttribute("max", today);
});

if (uagent.indexOf('AppContainer') !== -1) {
    pwa = 'paytm';
    $('.paymentsBlock').hide();
    $('.linkBlock').hide();
    var truecallerBTNElement = document.getElementById('truecallerBTN');
    var truecallerOrElement = document.getElementById('truecallerOr');

    if (truecallerBTNElement) {
        truecallerBTNElement.style.display = 'none';
    }
    if (truecallerOrElement) {
        truecallerOrElement.style.display = 'none';
    }
    if (document.getElementById("foot") != null) {
        document.getElementById("foot").innerHTML = "Made with Love in India by <a style='color:#fff'> Uengage</a>";
    }

}

function scrollFunction() {
    var mybutton = document.getElementById("myBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
if (document.querySelector('.wrapper-menu')) {
    var wrapperMenu = document.querySelector('.wrapper-menu');

    wrapperMenu.addEventListener('click', function() {
        wrapperMenu.classList.toggle('open');
    });

}

if ('OTPCredential' in window) {
    window.addEventListener('DOMContentLoaded', e => {
        // alert("hhhh"); 
        const pId = "<?php echo $pId;?>";
        const input = document.querySelector('input[autocomplete="one-time-code"]');
        if (!input) return;
        const ac = new AbortController();
        //      const form = input.closest('form');
        //      if (form) {
        //        form.addEventListener('submit', e => {
        //          ac.abort();
        // alert
        //        });
        // }
        // alert(pId);
        // alert(pId);
        if (readSMS == 1) {
            navigator.credentials.get({
                otp: {
                    transport: ['sms']
                },
                signal: ac.signal
            }).then(otp => {
                // alert(pId);
                // alert(otp.code);
                input.value = otp.code;
                validateOTP(pId);
                //  if (form) form.submit();
                // console.log(otp);
            }).catch(err => {
                console.log(err);
            });
        }

    });
}

var gtm_items = [];
var value;

$(document).ready(function() {

    $('.current_currency').html(function(index, oldHtml) {

        return currency + '' + oldHtml;
    });

    if (localStorage.getItem('userdata') &&
        localStorage.getItem('userdata') != '' &&
        localStorage.getItem('business') &&
        localStorage.getItem('business') != '' && typeof showCartIcon != 'undefined' && showCartIcon == 1) {

        var businessId = JSON.parse(localStorage.getItem('business'));
        var userData = JSON.parse(localStorage.getItem('userdata'));
        var contactMappingId = userData['contactMappingId'];
        var post_param = {};
        post_param.businessId = businessId;
        post_param.contactMappingId = contactMappingId;
        var url = window.location.origin + "/client/getItemsCount";
        $.ajax({
            url: url,
            type: "POST",
            data: post_param,
            dataType: "json",
            async: false,
            success: function(response) {


                // Fetch the status and qty values
                var status = response.status;
                if (status == 1) {
                    var result = response.result;
                    if (typeof pId != 'undefined' && pId == 7175) {
                        $.each(result, function(index, res) {
                            var a = {};
                            a['item_id'] = res.ppItemId;
                            a['itemName'] = res.itemName;
                            a['quantity'] = res.qty;
                            gtm_items.push(a);
                        });
                    } else {
                        $.each(result, function(index, res) {
                            var a = {};
                            a['item_id'] = res.itemId;
                            a['itemName'] = res.itemName;
                            a['quantity'] = res.qty;
                            gtm_items.push(a);
                        });
                    }
                    value = result.reduce((total, item) => total + parseInt(item.price), 0);
                    var qty = result.reduce((total, item) => total + parseInt(item.qty), 0);
                    if (qty > 0) {
                        $('#cart_icons').removeClass('d-none');
                        $('#cartsItemCounts').html(qty);
                        $('body .search-icon-dv > span').text(qty);
                    } else {
                        $('#cart_icons').removeClass('d-none');
                        $('#cartsItemCounts').html("0");
                        // $('body .search-icon-dv').hide();
                        $('body .search-icon-dv > span').text(0);

                    }
                } else {
                    $('#cart_icons').removeClass('d-none');
                    $('#cartsItemCounts').html("0");
                    // $('body .search-icon-dv').hide();

                }
            }
        });

    } else {

        if (localStorage.getItem('itemList') && localStorage.getItem('itemList') != '' &&
            localStorage.getItem('business') && localStorage.getItem('business') != '' && typeof showCartIcon != 'undefined' && showCartIcon == 1) {
            var jsonArray = JSON.parse(localStorage.getItem('itemList'));
            var businessId = JSON.parse(localStorage.getItem('business'));
            const matchingObject = jsonArray.find(obj => obj.bId == businessId);

            if (matchingObject) {
                let qtySum = matchingObject.items.reduce((total, item) => total + item.qty, 0);
                value = matchingObject.items.reduce((total, item) => total + parseFloat(item.sp), 0);
                if (pId == 7175) {
                    matchingObject.items.forEach(item => {
                        const itemId = item.itemId;
                        const index = gtm_items.findIndex(existingItem => existingItem.item_id === itemId);

                        if (index === -1) {
                            gtm_items.push({
                                item_id: itemId,
                                item_name: item.itemName,
                                quantity: parseInt(item.qty),
                            });
                        } else {
                            gtm_items[index].quantity += parseInt(item.qty);
                        }
                    });
                } else {
                    matchingObject.items.forEach(item => {
                        const itemId = item.itemId;
                        const index = gtm_items.findIndex(existingItem => existingItem.item_id === itemId);

                        if (index === -1) {
                            gtm_items.push({
                                item_id: itemId,
                                item_name: item.itemName,
                                quantity: parseInt(item.qty),
                            });
                        } else {
                            gtm_items[index].quantity += parseInt(item.qty);
                        }
                    });
                }
                if (qtySum > 0) {
                    $('#cart_icons').removeClass('d-none');
                    $('#cartsItemCounts').html(qtySum);
                    $('body .search-icon-dv > span').text(qtySum);
                } else {
                    $('#cart_icons').removeClass('d-none');
                    $('#cartsItemCounts').html("0");

                    $('body .search-icon-dv > span').text(0);
                    // $('body .search-icon-dv').hide();

                }

            }



        }

    }

    $('#search-modal').on('shown.bs.modal', function() {
        $('#searchText').focus();
    })

    $('#faqsmodal').on('shown.bs.modal', function() {

        if (typeof webengage_tag == "function") {

            webengage.track("Link Clicked", {
                "Link Clicked": "FAQs"
            });
        }
    });

    $('#raseaconcern').on('shown.bs.modal', function() {

        if (typeof webengage_tag == "function") {

            webengage.track("Link Clicked", {
                "Link Clicked": "Raise a Concern"
            });
        }
    });

    $('.emailLink').on('click', function(event) {
        if (typeof webengage_tag == "function") {

            webengage.track("Contact Clicked", {
                "Medium": "Email",
                "Value": outlet_email
            });
        }
    });

    $('.mobileLink').on('click', function(event) {
        if (typeof webengage_tag == "function") {

            webengage.track("Contact Clicked", {
                "Medium": "Phone",
                "Value": outlet_contact
            });
        }
    });


    $('.fb_link').on('click', function(event) {
        if (typeof webengage_tag == "function") {

            webengage.track("Social Media Viewed", {
                "Platform": "Facebook"
            });
        }
    });

    $('.ig_link').on('click', function(event) {
        if (typeof webengage_tag == "function") {

            webengage.track("Social Media Viewed", {
                "Platform": "Instagram"
            });
        }
    });



    $(".search-btn").click(function() {
        $("#search-bar").slideToggle("fast");
        $('#searchText').focus();
    });

    $("section").click(function() {
        $(".navbar-collapse").removeClass("show");

    });

    $("section").click(function() {
        $(".wrapper-menu").removeClass("open");
    });

    // $(".nav-icon").click(function(){
    //    $(this).toggleClass("nav-icon-active")
    // });

    $(".btn-left-menu").click(function() {
        $(".left-panel").css("height", "100%");
    });
    $(".menu-close").click(function() {
        $(".left-panel").css("height", "0");
    });



    // $(".od-right .order-option a").click(function(e){
    //    $(".order-option a").removeClass("active");
    //    $(this).addClass("active");
    // });
    $('.qty-increase').click(function(e) {
        e.preventDefault();
        var quantity = parseInt($('#qty-input').val());
        $('#qty-input').val(quantity + 1);
        $(".price").text(price * 2);
    });
    $('.qty-decrease').click(function(e) {
        e.preventDefault();
        var quantity = parseInt($('#qty-input').val());
        if (quantity > 0) {
            $('#qty-input').val(quantity - 1);
        }
    });

    if (/android/i.test(uagent)) {
        $('#android_detect').removeClass('d-none');
    } else {
        $('#android_detect').addClass('d-none');
    }

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        $('#ios_detect').removeClass('d-none');
    } else {
        $('#ios_detect').addClass('d-none');
    }

});

function checkout() {

    var slug = localStorage.getItem('slug');
    var orderType = localStorage.getItem('orderType');

    if (gtm_items.length > 0) {
        if (typeof gtm_tag == "function") {

            dataLayer.push({
                ecommerce: null
            });
            dataLayer.push({
                'event': "view_cart",
                'ecommerce': {
                    'currency': "INR",
                    'value': value,
                    'items': gtm_items
                }
            });
        }
    }
    if (slug == '' || slug == null) {
        slug = 'online-order';
        window.location.href = "/" + slug;
        return;
    }
    if (slug.startsWith('order/')) {
        window.location.href = "/" + slug;
    } else if (slug.startsWith('reservation/')) {
        window.location.href = "/" + slug;
    } else if (orderType == 5) {
        window.location.href = "/reservation/" + slug;
    } else {
        window.location.href = "/order/" + slug;
    }
}

(function(window, $) {
    $(function() {
        $('.btn').on('click', function(event) {
            // event.preventDefault();
            var $btn = $(this),
                $div = $('<div/>'),
                btnOffset = $btn.offset(),
                xPos = event.pageX - btnOffset.left,
                yPos = event.pageY - btnOffset.top;
            $div.addClass('ripple-effect');
            $div
                .css({
                    height: $btn.height(),
                    width: $btn.height(),
                    top: yPos - ($div.height() / 2),
                    left: xPos - ($div.width() / 2),
                    background: $btn.data("ripple-color") || "#fff"
                });
            $btn.append($div);
            window.setTimeout(function() {
                $div.remove();
            }, 2000);
        });
    });
})(window, jQuery);


$(document).ready(function() {
    if (localStorage.getItem("userdata") && localStorage.getItem("userdata") != '' && localStorage.getItem("userdata") != null) {

        $('body #payBtn').show();

    } else {
        $('body #loginBtnPay').show();

    }

    if (typeof(Storage) !== "undefined") {
        if (!localStorage.getItem('userdata') || localStorage.getItem('userdata') == '') {
            $('body #lgBtn').show();
            $('body #loginBtn').hide();
            $('.accountdvlogin').show();
            $('#welLgBTN').hide();
            $('.accountdv').hide();
            $('.walletShow').hide();
            $('.walletGuest').show();
            $('#showRaiseConcern').hide();
        } else {
            $('body #lgBtn').hide();
            $('body #loginBtn').show();
            $('.accountdvlogin').hide();
            var userData = JSON.parse(localStorage.getItem('userdata'));
            $('#welLgBTN').show();
            $('.accountdv').show();
            $('.walletShow').show();
            $('.walletGuest').hide();
            $('#showRaiseConcern').show();
            //  $('#welLgBTN').html('Welcome '+userData.name)

        }
    } else {
        $('#lgBtn').show();
        $('#showRaiseConcern').hide();
        $('.accountdvlogin').show();
    }

});




// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    $('html,body').animate({
        scrollTop: 0
    }, 'slow');

}

function openLogin() {

    if (typeof webengage_tag == "function") {

        webengage.track("Link Clicked", {
            "Link Clicked": "Login"
        });
    }

    if (pwa == 'paytm') {
        //   alert("paytm");
        tryCount = 0;
        paytmLogin();
    } else {
        $('#mobileNo').val('');
        $('#email_Id').val('');
        $('#validateOTP, #OTP').hide();
        $('#sendOTP').show();
        $('#OTP').val('');
        $('#resendOTP').hide();
        $(".submit_btn").addClass("disable");
        $('#loginModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        var codeBoxes = document.querySelectorAll(".passcode-wrapper input");

        // Loop through each input field and set its value to an empty string
        codeBoxes.forEach(function(codeBox) {
            codeBox.value = "";
        });
    }

}

function checkLogin(ecomm, cBID) {
    if (!localStorage.getItem('userdata') || localStorage.getItem('userdata') == '') {
        openLogin();
        return;
    } else {
        if (ecomm == 1) {
            var url = window.location.origin + "/checkout/" + cBID + "/1";
            window.location.href = url;
            return;
        }

    }

}

$('#mobileNo, #OTP').keypress(function(e) {
    return isNumber(e);
});



function sendOTP(pId) {
    var mobileNo = $('#mobileNo').val();
    if (mobileNo == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobileNo.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide();
        return false;
    }
    var recaptchaResponse = '';
    if (reCaptcha == 1) {
        recaptchaResponse = grecaptcha.getResponse();

        if (!recaptchaResponse) {
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html("Please complete the reCAPTCHA.");
            errormodalhide();
            return;
        }
    } else {
        recaptchaResponse = '';
    }

    var url = origin + "/client/login/" + mobileNo + "/" + pId;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        data: {
            "recaptchaResponse": recaptchaResponse
        },
        success: function(result) {

            if (result.status == 0) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result.msg);
                errormodalhide();
                if (result['msg'] != 'Cannot Resend OTP Again.Please wait for sometime') {
                    return;
                }
            }
            readSMS = 1;
            $('#enter_number').html(mobileNo);
            $('#verifyotp').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#verifyotp').modal('show');
            $('#loginModal').modal('hide');
            $('#validateOTP').show();
            setTimeout(function() {
                $('#resendOTP').show()
            }, 30000);
            $('#sendOTP').hide();
            $('#OTP').show();
            $('#truecallerOr').hide();
            $('#truecallerBTN').hide();
            //$('#mobileNo').attr('readonly',true);
            if (result['status'] == 0) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
            } else {
                /*$('#promoapplied').modal('show');
                $('.promors').html(result['msg']);
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);*/
            }

            if (typeof gtag == "function") {

                // console.log(tag);
                gtag('event', 'send_otp');
            }

            // $('#closeLoginModal').hide();
            //setTimeout(function() { $('#resendOTP').show(); }, 60000);

        }
    });
}

function sendEmailOTP(pId) {
    var email_Id = $('#email_Id').val();
    if (email_Id == '') {
        //   showAlert('');
        $('#errorMessageLogin').html('');
        $('#errorMessageLogin').html("Kindly Enter Valid Email Id");
        $("#danger-alert-login").fadeTo(2000, 500).slideUp(500, function() {
            $("#danger-alert-login").slideUp(500);
        });
        return false;
        //   return false;
    }
    var url = origin + "/email_login/login?email=" + email_Id + "&businessId=" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {
                //   showAlert();
                $('#verifyotp').modal('hide');
                $('#loginModal').modal('show');
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
                return false;
            } else {
                $('#email_enter').html(email_Id);
                $('#emailverifyotp').modal('show');
                $('#emailverifyotp').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#loginModal').modal('hide');
                cMappingId = result['contactIdMappingId'];
                $('#promoapplied').modal('show');
                $('.promors').html(result['msg']);
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);
            }
        }
    });
}

function resendOTP(pId) {
    var mobileNo = $('#mobileNo').val();
    if (mobileNo == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobileNo.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide();
        return false;
    }
    var mobileNo = $('#mobileNo').val();
    var url = origin + "/client/login/" + mobileNo + "/" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
                return false;
            } else {

                $('#promoapplied').modal('show');
                $('.promors').html(result['msg']);
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);
            }
        }
    });

}

function errormodalhide() {
    setTimeout(function() {
        $('#promonotapplied').modal('hide')
    }, 2500);
}

let userClickedWalletGuest = false;

// Add a click event listener to the element with class "walletGuest"
$('.walletGuest').click(function() {

    userClickedWalletGuest = true;
    openLogin();
});

function validateOTP(pId) {

    if (window.SMS) {
        document.addEventListener('onSMSArrive', function(e) {
            var sms = e.data;
            // Check if the SMS message contains an OTP code
            var otpRegex = /(\d{6})/;
            var match = sms.body.match(otpRegex);
            if (match) {
                // Fill the input fields with the OTP code
                var code = match[1];
                $('#codeBox1').val(code[0]);
                $('#codeBox2').val(code[1]);
                $('#codeBox3').val(code[2]);
                $('#codeBox4').val(code[3]);
                $('#codeBox5').val(code[4]);
                $('#codeBox6').val(code[5]);
            }
        });
    }

    var mobileNo = $('#mobileNo').val();
    var OTP = '';
    $('.passcode-wrapper input').each(function() {
        OTP += $(this).val();
    });
    //var OTP = $('#OTP').val();
    if (mobileNo == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobileNo.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide()
        return false;
    }

    if (OTP == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter OTP.");
        errormodalhide();
        return false;
    }

    if (OTP.length != 6) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("OTP should be 6 digits only.");
        errormodalhide()
        return false;
    }


    var url = origin + "/client/validateMobileByOTP/" + mobileNo + "/" + OTP + "/" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {

                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide()
                return false;
            } else {
                $('#promoapplied').modal('show');
                $('.promors').html('Login Successful');
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);
                if (typeof gtag == "function") {

                    // console.log(tag);
                    gtag('event', 'login_success');
                }


                if (typeof fbq == "function") {
                    fbq('track', 'CompleteRegistration');
                }





                readSMS = 0;
                var userdata = {
                    contactId: result['rows']['contactId'],
                    token: result['rows']['token'],
                    contactMappingId: result['rows']['contactMappingId'],
                    mobile: mobileNo,
                    name: result['rows']['name'],
                    email: result['rows']['email'],
                    dob: result['rows']['dob'],
                    gender: result['rows']['gender'],
                    anniversary: result['rows']['anniversary'],
                    married: result['rows']['married']
                }
                // userdata=;

                if (typeof webengage_tag == "function") {

                    if (result['rows']['newUser'] == 1) {

                        webengage.track("Customer Registered", {
                            "Phone Number": mobileNo
                        });

                    }
                    webengage.user.login('+91' + mobileNo);
                    webengage.user.setAttribute('we_phone', '+91' + mobileNo);
                    if (userdata.email != null && userdata.email != '' && userdata.email != "null") {
                        webengage.user.setAttribute('we_email', userdata.email);
                    }
                    if (userdata.gender != null && userdata.gender != '' && userdata.gender != "null") {
                        var gender = userdata.gender.toLowerCase();
                        webengage.user.setAttribute('we_gender', gender);
                    }
                    if (userdata.dob != null && userdata.dob != '' && userdata.dob != "null") {
                        webengage.user.setAttribute('we_birth_date', userdata.dob);
                    }
                    if (userdata.anniversary != null && userdata.anniversary != '' && userdata.anniversary != "null") {
                        webengage.user.setAttribute('we_anniversary_date', userdata.anniversary);
                    }
                    if (userdata.name != null && userdata.name != '' && userdata.name != "null") {
                        webengage.user.setAttribute('we_first_name', userdata.name);
                    }

                    webengage.user.setAttribute('we_whatsapp_opt_in', true);
                }

                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                $('#loginModal').modal('hide');
                $('#verifyotp').modal('hide');
                $('#mobileNo').val('');
                $('#validateOTP, #OTP').hide();
                $('#sendOTP').show();
                $('#OTP').val('');
                $('#resendOTP').hide();
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('.walletGuest').hide();
                $('.walletShow').show();
                $('body #loginBtnPay').hide();
                $('body #payBtn').show();

                var codeBoxes = document.querySelectorAll(".passcode-wrapper input");

                // Loop through each input field and set its value to an empty string
                codeBoxes.forEach(function(codeBox) {
                    codeBox.value = "";
                });

                if (result['rows']['name'] == '' || result['rows']['name'] == null || result['rows']['name'] == "null") {
                    document.getElementById("namevalue").innerText = "User";
                } else {
                    document.getElementById("namevalue").innerText = result['rows']['name'];
                }

                document.getElementById("emailvalue").innerText = result['rows']['email'];



                if ((result['rows']['name'] == '' || result['rows']['name'] == null || result['rows']['name'] == 'user' || result['rows']['name'] == 'User') && !localStorage.getItem('userProfile')) {
                    if (result['rows']['email'] != null && result['rows']['email'] != 'null' && result['rows']['email'] != '') {
                        $('#uEmail').val(userdata['email']);
                    }
                    $('#updateProfileModal_new').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    localStorage.setItem('userProfile', true);
                }

                if (userClickedWalletGuest) {
                    window.location.href = origin + '/wallet';
                }

                if (window.location.href.endsWith("wallet")) {
                    // Refresh the page
                    location.reload();
                }

                if (window.location.pathname.indexOf("nps") > -1) {
                    checkFormSubmitted();
                }

                if (localStorage.getItem('userdata').length > 0) {
                    $('#loginBtn').show();
                    $('#lgBtn').addClass('d-none');
                }
                if (((window.location.href.indexOf("reservation/") > -1) || (window.location.href.indexOf("order/") > -1)) && window.location.href.indexOf("online-order") == -1) {
                    add_to_cart('add', '');
                }
                if (window.location.href.indexOf("checkout") > -1) {
                    add_to_cart_login();
                    location.reload();
                }
                if (typeof gtag === "function") {

                    gtag('event', 'otp_validated', {
                        'event_category': 'otp_validated',
                        'event_label': 'OTP Validated', // Label describing the button
                        'value': 1 // Optional: you can pass a value if needed
                    });
                }
            }
        }
    });
}

document.addEventListener('keydown', function(event) {
    var enterKey = 'Enter';
    if (event.key === enterKey) {
        var firstModal = document.getElementById('loginModal');
        var secondModal = document.getElementById('verifyotp');
        var thirdModal = document.getElementById('emailverifyotp');
        var activeElement = document.activeElement;

        if (firstModal.style.display === 'block' && activeElement.id === 'email_Id') {
            event.preventDefault(); // Prevent form submission by Enter key press
            sendEmailOTP(pId); // Call the sendEmailOTP function
        } else if (firstModal.style.display === 'block') {
            event.preventDefault(); // Prevent form submission by Enter key press
            sendOTP(pId); // Call the sendOTP function
        } else if (secondModal.style.display === 'block') {
            event.preventDefault(); // Prevent form submission by Enter key press
            validateOTP(pId); // Call the validateOTP function
        } else if (thirdModal.style.display === 'block') {
            event.preventDefault(); // Prevent form submission by Enter key press
            validateEmailOTP(pId); // Call the validateOTP function
        }
    }
});

document.addEventListener('keydown', function(event) {
    var enterKey = 'Enter';

    if (event.key === enterKey) {
        event.preventDefault();
    }
});

function validateEmailOTP(pId) {

    var OTP = '';
    $('.passcode-wrapper input').each(function() {
        OTP += $(this).val();
    });
    if (OTP == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter OTP.");
        errormodalhide();
    }

    var url = origin + "/email_login/verifyotp?contactMappingId=" + cMappingId + "&otp=" + OTP;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {

                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
            } else {
                var userdata = {
                    contactId: result['rows']['contactId'],
                    token: result['rows']['token'],
                    contactMappingId: result['rows']['contactMappingId'],
                    mobile: '',
                    name: result['rows']['name'],
                    email: result['rows']['email'],
                    dob: result['rows']['dob'],
                    gender: result['rows']['gender'],
                    anniversary: result['rows']['anniversary'],
                    married: result['rows']['married']
                }
                // userdata=;
                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                $('#loginModal').modal('hide');
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('#emailverifyotp').modal('hide');
                $('.walletGuest').hide();
                $('.walletShow').show();

                if ((result['rows']['name'] == '' || result['rows']['name'] == null || result['rows']['name'] == 'user' || result['rows']['name'] == 'User') && !localStorage.getItem('userProfile')) {
                    if (result['rows']['email'] != null && result['rows']['email'] != 'null' && result['rows']['email'] != '') {
                        $('#uEmail').val(userdata['email']);
                    }
                    $('#updateProfileModal_new').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    localStorage.setItem('userProfile', true);
                }

                if (result['rows']['name'] == '' || result['rows']['name'] == null || result['rows']['name'] == "null") {
                    document.getElementById("namevalue").innerText = "User";
                } else {
                    document.getElementById("namevalue").innerText = result['rows']['name'];
                }


                document.getElementById("emailvalue").innerText = result['rows']['email'];

                if (userClickedWalletGuest) {
                    window.location.href = origin + '/wallet';
                }

                if (((window.location.href.indexOf("reservation/") > -1) || (window.location.href.indexOf("order/") > -1)) && window.location.href.indexOf("online-order") == -1 && window.location.href.indexOf("/") == -1) {
                    add_to_cart('add', '');
                }
            }
        }
    });
}

function verifyPassword(pId) {
    // var email_Id=$('#email_Id').val();
    var EmailPassword = encodeURIComponent($('#EmailPassword').val());
    var url = origin + "/email_login/verifypassword?contactMappingId=" + cMappingId + "&password=" + EmailPassword + "&businessId=" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {

                $('#errorMessageLogin').html('');
                $('#errorMessageLogin').html(result['msg']);
                $("#danger-alert-login").fadeTo(2000, 500).slideUp(500, function() {
                    $("#danger-alert-login").slideUp(500);
                });
                return false;
            } else {
                // readSMS=0;
                var userdata = {
                    contactId: result['rows']['contactId'],
                    token: result['rows']['token'],
                    contactMappingId: result['rows']['contactMappingId'],
                    mobile: '',
                    name: result['rows']['name'],
                    email: result['rows']['email'],
                    dob: result['rows']['dob'],
                    gender: result['rows']['gender'],
                    anniversary: result['rows']['anniversary'],
                    married: result['rows']['married']
                }
                // userdata=;
                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                $('#loginModal').modal('hide');
                $('#verifyotp').modal('hide');
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('.walletShow').show();
                $('.walletGuest').hide();
                if (((window.location.href.indexOf("reservation/") > -1) || (window.location.href.indexOf("order/") > -1)) && window.location.href.indexOf("online-order") == -1) {
                    add_to_cart('add', '');
                }
            }
        }
    });
}


function updateProfileEmail(pId) {
    if ($('#EUpdateName').val() == '') {
        alert("Name is Mandatory!");
        return false;
    }
    if ($('#EUpdatePassword').val() == '') {
        alert("Password is Mandatory!");
        return false;
    }
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var params = 'contactMappingId=' + userData['contactMappingId'] +
        '&businessId=' + pId + '&name=' + $('#EUpdateName').val() + '&password=' + $('#EUpdatePassword').val();

    $.ajax({
        type: 'POST',
        url: origin + "/email_login/addinfo?" + params,
        // data	: {"email":value},
        dataType: "json",
        headers: {
            'token': userData['token']
        },
        async: false

    }).done(function(response) {
        if (response['status'] == 1) {
            var userData = JSON.parse(localStorage.getItem('userdata'));
            userData['name'] = $('#EUpdateName');
            localStorage.setItem('userdata', JSON.stringify(userData));
            $('#updateProfileModal').modal('hide');

        }

    });
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}

$(".tspace").on("keyup", function() {
    var length = $.trim($(this).val()).length;
    if (length == 0) {
        $(this).val("");
    } else {
        $(this).val($(this).val().trimLeft(""));
    }
})

$('.block-start-space').keypress(function(e) {
    if ($(this).val() == '') {
        if (!/[0-9a-zA-Z-]/.test(String.fromCharCode(e.which)))
            return false;
    }
})

$(document).on('keydown', '#uEmail', function(e) {
    if (e.which === 32) {
        return false;
    }
});

function isNumber(evt) {
    let iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

    return true;
}

// trim space
$(".block-start-space").on("keyup", function() {
    var length = $.trim($(this).val()).length;
    if (length == 0) {
        $(this).val("");
    } else {
        $(this).val($(this).val().trimLeft(""));
    }
})

function skipModal() {
    $('#updateProfileModal_new').modal('hide');
    if (window.location.href.indexOf("checkout") > -1) {
        openPayment();
    }
}

function uProfileUpdate(pId) {
    if ($('#FullName').val() == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please Enter Full Name");
        errormodalhide();
        return false;
    }

    var emailId = $('#EmailAddress').val();

    if (emailId != '' && emailId != null) {
        if (validateEmail(emailId) == false) {
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html("Please enter valid Email Address");
            errormodalhide();
            return false;
        }
    }



    var gender = '';
    if ($('input[name="gender"]:checked').val() != undefined) {
        gender = $('input[name="gender"]:checked').val();
    }
    if (pId == 7175 && gender == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please select gender");
        setTimeout(function() {
            $('#promonotapplied').modal('hide')
        }, 2000);
        return false;
    }
    var dob = '';
    if ($('#DateOfBirth').val() != undefined) {
        dob = $('#DateOfBirth').val();
    }
    var married = '';
    var anniversary = '';
    if ($('#AniversaryLabel').val() != undefined) {
        anniversary = $('#AniversaryLabel').val();
        married = 1;
    }

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var params = 'contactMappingId=' + userData['contactMappingId'] + '&token=' + userData['token'] +
        '&contactId=' + userData['contactId'] + '&businessId=' + pId + '&name=' + $('#FullName').val() +
        '&email=' + emailId + "&gender=" + gender + "&dob=" + dob + "&married=" + married + "&anniversary=" + anniversary;

    $.ajax({
        type: 'GET',
        url: origin + "/client/updateProfile?" + params,
        // data	: {"email":value},
        dataType: "json",
        async: false

    }).done(function(response) {
        if (response['status'] == 1) {
            var userData = JSON.parse(localStorage.getItem('userdata'));
            userData['name'] = $('#FullName').val();
            userData['email'] = $('#EmailAddress').val();
            userData['dob'] = $('#DateOfBirth').val();
            userData['gender'] = gender;
            userData['anniversary'] = $('#AniversaryLabel').val();
            document.getElementById("namevalue").innerText = $('#FullName').val();
            document.getElementById("emailvalue").innerText = $('#EmailAddress').val();
            localStorage.setItem('userdata', JSON.stringify(userData));
            if (typeof webengage_tag == "function") {

                if (userData['dob'] != null && userData['dob'] != '' && userData['dob'] != "null") {
                    var c_dob = new Date(userData['dob']);
                } else {
                    var c_dob = '';
                }

                if (userData['anniversary'] != null && userData['anniversary'] != '' && userData['anniversary'] != "null") {
                    var c_ann = new Date(userData['anniversary']);
                } else {
                    var c_ann = '';
                }

                webengage.track("Form Filled", {
                    "Phone Number": userData['mobile'],
                    "Email": userData['email'],
                    "First Name": userData['name'],
                    "Birth Date": c_dob,
                    "Anniversary Date": c_ann
                });

                if (userData['anniversary'] != null && userData['anniversary'] != '' && userData['anniversary'] != "null") {
                    webengage.user.setAttribute('we_anniversary_date', userData['anniversary']);
                }

                if (userData['dob'] != null && userData['dob'] != '' && userData['dob'] != "null") {
                    webengage.user.setAttribute('we_birth_date', userData['dob']);
                }



            }
            $('#updateProfileModal_new').modal('hide');
            $('#promoapplied').modal('show');
            $('.promors').html(response['msg']);
            setTimeout(function() {
                $('#promoapplied').modal('hide')
            }, 2500);
            if (window.location.href.indexOf("checkout") > -1) {
                openPayment();
            }


        }

    });
}

function showAlert(msg) {
    $('#errorMessage').html('');
    $('#errorMessage').html(msg);
    $("#danger-alert").fadeTo(2000, 500).slideUp(500, function() {
        $("#danger-alert").slideUp(500);
    });
}

function logout() {
    localStorage.clear();
    if (typeof webengage_tag == "function") {

        webengage.track("Link Clicked", {
            "Link Clicked": "Logout"
        });

        webengage.user.logout();
    }
    window.location.href = '/';
}


function searchExpand() {
    var dev = document.getElementById('searchBar');
    var style = window.getComputedStyle(dev);
    if (style.display == 'none') {
        $('#searchBar').show();
        $('#search').focus();
    } else {
        $('#searchBar').hide();
    }

}

function closeSearch() {
    if ($('#search').val() == '') {
        $('#searchBar').hide();
    }

}

function profile() {

    window.location.href = '/profile';
}

function storeCityPage(city) {
    window.location.href = '/store-locator/' + city;
}

function storeDetailsPage(city, slug) {
    window.location.href = '/store-locator/' + city + "/" + slug;
}

function orderPage(slug) {
    window.location.href = '/order/' + slug;
}

function redirectPage(page) {
    window.location.href = page;
}

function call(phoneNo) {
    window.open("tel:" + phoneNo);
}

function truecallerLogin(pId) {
    let requestNonce = pId + '-' + Math.floor(Math.random() * 100000000);; // random number of length 8 to 64 characters
    window.location = "truecallersdk://truesdk/web_verify?" +
        "type=btmsheet&" +
        "requestNonce=" + requestNonce +
        "&partnerKey=" + truecaller_key +
        "&partnerName=" + encodeURI(businessName) +
        "&lang=en&loginPrefix=placeorder&loginSuffix=login&ctaPrefix=proceedwith&ctaColor=%230099ff&ctaTextColor=%23ffffff&btnShape=Round&skipOption=Later";

    setTimeout(function() {

        if (document.hasFocus()) {
            alert("Oops! Truecaller Not Installed");

        } else {
            truecallerRequestId = requestNonce;
            $('#truecallerModal').modal('show');
            getTruecallerLoginStatus();
        }
    }, 600);
}

function paytmLogin() {
    JSBridge.call('paytmFetchAuthCode', {
        clientId: paytm_mId,
    }, function(result) {
        // alert(JSON.stringify(result))
        getPaytmAuthCode(result);
    });
}

function tryPaytmLogin() {
    $('.paytmConsentModal').modal('hide');
    paytmLogin();
}

function popoutPaytm() {
    JSBridge.call('popWindow');
}
$('#verifyotp').on('show.bs.modal', function() {
    setTimeout(() => {
        $('#codeBox1').trigger('focus');
    }, 1000);

})

$('#loginModal').on('show.bs.modal', function() {
    setTimeout(() => {
        $('#mobileNo').trigger('focus');
    }, 1000);

})

function getPaytmAuthCode(res) {
    // alert(JSON.stringify(res));
    if (res['error'] == -1 || res['error'] == -2) {
        // alert(tryCount);
        //  tryCount++;
        //  if(tryCount>3){
        //      JSBridge.call('popWindow');
        //  }else{
        //    //   $('#main-loader1').hide();
        //     $('.paytmConsentModal').modal('show');
        //  }

    } else if (res['error'] != undefined) {
        alert("Unable to Fetch the Login Details");
        setTimeout(function() {
            window.location.href = "#/home-feed";
        }, 1700);
    } else {
        // alert("https://www.uengage.in/client/getAuthCodePaytm"+pId);
        //  $('#main-loader1').show();
        $.ajax({
            type: 'GET',
            url: "https://www.uengage.in/client/getAuthCodePaytm/" + pId,
            data: {
                "authCode": JSON.stringify(res)
            },
            async: false

        }).done(function(data) {
            //  alert(data)
            data = JSON.parse(data);

            //   $('#main-loader1').hide();
            if (data.status == 1) {
                var userdata = {
                    contactId: data.rows.contactId,
                    token: data.rows.token,
                    contactMappingId: data.rows.contactMappingId,
                    mobile: data.rows.mobileNo,
                    name: data.rows.name,
                    email: data.rows.email,
                    gender: data.rows.gender,
                    anniversary: data.rows.anniversary,
                    married: data.rows.married,
                    dob: data.rows.dob
                }
                // alert(data.rows.name);
                // var db1 = getLocalStorage();
                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                // $('#main-loader1').hide();
                $('#loginModal').modal('hide');
                $('#verifyotp').modal('hide');
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('.walletShow').show();
                $('.walletGuest').hide();
                if (((window.location.href.indexOf("reservation/") > -1) || window.location.href.indexOf("order/") > -1) && window.location.href.indexOf("online-order") == -1) {
                    if (pId == 6156) {
                        add_to_cart('add', '');
                    } else {
                        add_to_cart('view', '');
                    }

                }
            } else {
                JSBridge.call('popWindow');
                // window.location.href = "https://pwa.uen.io/#/login";
            }

        });
    }
}

function getEmailId(userdata) {
    swal("Kindly enter the Email Id:", {
            content: "input",
        })
        .then((value) => {
            // alert(value);
            if (value == '') {
                swal({
                    title: "Login is mandatory to proceed?",
                    icon: "warning",
                    buttons: false,
                    timer: 1500
                })
                getEmailId(userdata);
            } else {

                var businessId = "5";
                var params = 'contactId=' + userdata.contactId + '&contactMappingId=' + userdata.contactMappingId +
                    '&businessId=' + businessId + '&token=' + userdata.token;
                // alert(params);
                $.ajax({
                    type: 'POST',
                    url: "https://www.uengage.in/client/updateProfile?" + params,
                    data: {
                        "email": value
                    },
                    // headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                    async: false

                }).done(function(response) {
                    // alert("ss");
                    // alert(response);
                    data = JSON.parse(response);
                    // alert(data);
                    $scope.loading = false;

                    if (response.data.status == 0) {

                        if (response.data.msg == 'Invalid Token') {
                            $location.path('/logout');
                        }

                    } else {
                        swal({
                            title: "Successfully Updated",
                            text: response.data.msg,
                            timer: 1500,
                            button: false,
                            showConfirmButton: false,
                            icon: "success"
                        });
                        var db1 = getLocalStorage();
                        userdata.email = value;
                        //   alert(userdata);
                        db1.setItem('userdata', JSON.stringify(userdata));
                        $('#main-loader1').hide();
                    }


                });
            }
        });
}


function getTruecallerLoginStatus() {

    if (pollingCount == 10) {
        closePolling();
        // alert("Oops! Not Able to fetch the Details");
        $('#truecallerModal').modal('hide');
        return false;
    } else {
        $.ajax({
            type: 'GET',
            url: "https://" + domain + "/client/getTrueCallerStatus",
            data: {
                "requestId": truecallerRequestId,
                "pId": pId
            },
            async: false

        }).done(function(data) {
            data = JSON.parse(data);
            if (data.status == 1) {
                $('#truecallerModal').modal('hide');
                closePolling();
                var userdata = {
                    contactId: data.rows.contactId,
                    token: data.rows.token,
                    contactMappingId: data.rows.contactMappingId,
                    mobile: data.rows.mobileNo,
                    name: data.rows.name,
                    email: data.rows.email,
                    gender: data.rows.gender,
                    anniversary: data.rows.anniversary,
                    married: data.rows.married,
                    dob: data.rows.dob
                }
                // alert(data.rows.name);
                // var db1 = getLocalStorage();
                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                $('#loginModal').modal('hide');
                $('#verifyotp').modal('hide');
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('.walletShow').show();
                $('.walletGuest').hide();
                if (((window.location.href.indexOf("reservation/") > -1) || window.location.href.indexOf("order/") > -1) && window.location.href.indexOf("online-order") == -1) {
                    add_to_cart('add', '');
                }

                $('#promoapplied').modal('show');
                $('.promors').html('Login Successful');
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);

            } else if (data.status == -1) {
                closePolling();
                $('#truecallerModal').modal('hide');
                $('#promoapplied').modal('hide');
                return false;

            } else {
                pollingCount++;
                setTimeout(function() {
                        getTruecallerLoginStatus();
                    },
                    1000);
            }
        });
    }
}




function closePolling() {
    pollingCount = 0;
    truecallerRequestId = '';
}



function searchOutletViaPincode(pId) {
    var pincode = $('.pincodeArea').val();
    if (pincode == '' || pincode.length < 3) {
        $(".outleterrormsg").html("Please enter 3 digit of postcode or suburb");
        $(".outleterror").fadeTo(2000, 500).slideUp(500, function() {
            $(".outleterror").slideUp(500);
        });
        return false;
    }

    var params = 'areaId=' + pincode + '&parentBusinessId=' + pId;

    $.ajax({
        type: 'GET',
        url: "https://" + domain + "/email_login/GetAssignedBusiness?" + params,
        async: false,
        dataType: "json",

    }).done(function(data) {
        var bName = ''
        if (data['status'] == 1) {
            if (data['data'].length > 0) {
                for (var i = 0; i < data['data'].length; i++) {
                    bName += '<div class="col-md-4"><div class="card-inner">';
                    bName += '<div class="card-top"><h3>' + data['data'][i]['locality'] + ',' + data['data'][i]['locality'] + '</h3></div>';
                    bName += '<div class="card-middle"><ul class="card-uln">';
                    bName += '<li><i class="las la-map-marker"></i></li>';
                    bName += '<li>' + data['data'][i]['address'] + '</li></ul>';
                    bName += '<ul class="card-uln"><li><i class="las la-phone"></i></li><li>' + data['data'][i]['contactNumber'] + '</li></ul>';
                    var orderType = "";
                    if (data['data'][i]['onlineOrdersDelivery'] == 1) {
                        if (orderType == '') {
                            orderType = 'Delivery';
                        }
                    }
                    if (data['data'][i]['onlineOrdersSelfPickup'] == 1) {
                        if (orderType == '') {
                            orderType = 'Pickup';
                        } else {
                            orderType += ',Pickup';
                        }
                    }
                    bName += '<ul class="card-uln"><li><i class="las la-utensils"></i></li><li>' + orderType + '</li></ul>';
                    bName += '</div><div class="card-footerr"><ul class="footer-btns"><li><a href="tel:' + data['data'][i]['contactNumber'] + '">Call</a>';
                    bName += '</li><li><a target="_blank" href="https://www.google.com/maps/@' + data['data'][i]['latitude'] + ',' + data['data'][i]['longitude'] + '">Navigate</a></li>';
                    bName += '<li><a href="https://' + domain + '/order/' + data['data'][i]['slug'] + '" class="redd">order</a></li>';
                    bName += '</ul></div></div></div>';
                }

                $('.businessCards').html(bName);

            } else {
                $('.businessCards').html('<span id="noOutelet">Oops! No Outlet Found Near Area.</span>');
            }
        }


    });

}



if (typeof truecaller_key != "undefined" && truecaller_key != '') {
    // testing=1;
    const socialMediaAgents = [
        'Instagram',
        'FBAN', // Facebook
        'FBAV', // Facebook
        'Twitter',
        'Snapchat'
    ];

    const isSocialMediaApp = socialMediaAgents.some(agent => uagent.includes(agent));

    // testing=1;
    if (isSocialMediaApp) {
        // testing=0;
        var truecallerBTNElement = document.getElementById('truecallerBTN');
        var truecallerOrElement = document.getElementById('truecallerOr');

        if (truecallerBTNElement) {
            truecallerBTNElement.style.display = 'none';
        }
        if (truecallerOrElement) {
            truecallerOrElement.style.display = 'none';
        }

    } else if (/android/i.test(uagent)) {
        var truecallerBTNElement = document.getElementById('truecallerBTN');
        var truecallerOrElement = document.getElementById('truecallerOr');

        if (truecallerBTNElement) {
            truecallerBTNElement.style.display = 'block';
        }
        if (truecallerOrElement) {
            truecallerOrElement.style.display = 'block';
        }
    } else {
        // testing=0;
        var truecallerBTNElement = document.getElementById('truecallerBTN');
        var truecallerOrElement = document.getElementById('truecallerOr');

        if (truecallerBTNElement) {
            truecallerBTNElement.style.display = 'none';
        }
        if (truecallerOrElement) {
            truecallerOrElement.style.display = 'none';
        }

    }

} else {
    // testing=0;
    var truecallerBTNElement = document.getElementById('truecallerBTN');
    var truecallerOrElement = document.getElementById('truecallerOr');

    if (truecallerBTNElement) {
        truecallerBTNElement.style.display = 'none';
    }
    if (truecallerOrElement) {
        truecallerOrElement.style.display = 'none';
    }

}


var oPoolingCount = 0;

function checkOrderStatus(orderId, pId) {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var mobileNo = userData['mobile'];
    var url = origin + "/client/getOrderStatus?contactMappingId=" + contactMappingId + "&mobileNo=" + mobileNo + "&token=" + token + "&parentBusinessId=" + pId + "&orderId=" + orderId;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            if (data['status'] == 0) {
                if (oPoolingCount != 6) {
                    oPoolingCount++;
                    setInterval(function() {
                        checkOrderStatus(orderId, pId)
                    }, 5000);
                } else {
                    var redirectUrl = origin + "/payment-error/" + data['id'];
                    window.location.href = redirectUrl;
                }
            } else {
                $('.success-warning').hide();
                $('.success-img').show();

                var redirectUrl = origin + "/past-order";
                setTimeout(function() {
                    window.location.href = redirectUrl;
                }, 3000);



            }
        },
        error: function() {
            alert('error handling here');
        }
    });
}


function isEmail(email) {
    var EmailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return EmailRegex.test(email);
}


$(document).ready(function() {
    $(document).on('click', '.myDiv', function() {
        $('body').addClass('myBackground');
        $('.uengageoverlay').addClass('active');
        $('.sidenav').addClass('active');
        $('.newbtnspant').addClass('closebtn');
    })
    $(document).on('click', '.closebtn', function() {
        $('body').removeClass('myBackground');
        $('.uengageoverlay').removeClass('active');
        $('.sidenav').removeClass('active');
        $('.newbtnspant').addClass('myDiv');
        $('.newbtnspant').removeClass('closebtn');
    })
});
$(document).click(function(event) {
    if (!$(event.target).closest(".sidenav,.myDiv").length) {
        $("body").find(".sidenav").removeClass("active");
        $("body").find(".uengageoverlay").removeClass("active");
        $("html").find("body").removeClass("myBackground");
    }
});


if (window.history && window.history.pushState) {
    $('.modal').on('show.bs.modal', function(e) {
        window.history.pushState('forward', null);
    });

    $('.menu-top').on('.top-open.menu', function(e) {
        window.history.pushState('forward', null, './.modal');
    });

    $(window).on('popstate', function() {
        $('.modal').modal('hide');
        //$('.menu-top').hide();
        $(".modal-body").scrollTop(0);
    });
}

$("[data-dismiss='modal']").click(function() {
    $(".modal-body").scrollTop(0);
});

$('a.download-btn').click(function() {
    $(this).blur();
});

/*New Header*/
$("#menu-showhide").click(function() {
    $(".site-nav .navbar-collapse").toggleClass("menu-show");
    $("body").toggleClass("body-overflow");
});
$("#menu-showhide-normal").click(function() {
    $(".site-nav .navbar-collapse").toggleClass("menu-show");
    $("body").toggleClass("body-overflow");
});
$("section").click(function() {
    $(".site-nav .navbar-collapse").removeClass("menu-show");
    $("body").removeClass("body-overflow");
});
/*New Header*/

$(document).ready(function() {
    $(document).on('click', '.animatebtn', function(e) {
        $btn = $(this);
        var $offset = $(this).offset();
        $span = $('<span/>');
        var x = e.pageX - $offset.left
        var y = e.pageY - $offset.top;
        $span.addClass('ripple');
        $span.css({
            top: y + 'px',
            left: x + 'px',
        });
        $btn.append($span);
        window.setTimeout(function() {
            $span.remove();
        }, 2200);
    });

});

/*mobile number validation*/
$("#mobileNo").keyup(function(event) {
    var fieldValue = event.target.value;
    if (fieldValue.length == 10) {
        $("#sendOtpBtn").removeClass("disable");
    } else {
        $("#sendOtpBtn").addClass("disable");
    }
});
$("#email_Id").keyup(function(event) {
    $("#sendEmailOTP").removeClass("disable");
});
/*mobile number validation*/

/*login modal otp validation js*/
function getCodeBoxElement(index) {
    return document.getElementById('codeBox' + index);
}

function onKeyUpEvent(index, event, pId) {
    const eventCode = event.which || event.keyCode;

    if (getCodeBoxElement(index).value.length === 1) {
        if (index !== 6) {
            getCodeBoxElement(index + 1).focus();
        } else {
            getCodeBoxElement(index).blur();

            // Check if all fields are filled
            if (isOTPComplete()) {
                validateOTP(pId);
            } else {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(`Incomplete OTP`);
                setTimeout(() => {
                    $('#promonotapplied').modal('hide');
                }, 2500);
            }
        }
    }

    if (eventCode === 8 && index !== 1) {
        getCodeBoxElement(index - 1).focus();
    }
}

// Helper function to check if all inputs are filled
function isOTPComplete() {
    for (let i = 1; i <= 6; i++) {
        if (getCodeBoxElement(i).value.trim() === '') {
            return false;
        }
    }
    return true;
}

function onFocusEvent(index) {
    for (kitem = 1; kitem < index; kitem++) {
        const currentElement = getCodeBoxElement(kitem);
        if (!currentElement.value) {
            currentElement.focus();
            break;
        }
    }
}

function getCodeBoxElements(index) {
    return document.getElementById('codeBoxs' + index);
}

function onKeyUpEvents(index, event) {
    const eventCode = event.which || event.keyCode;
    if (getCodeBoxElements(index).value.length === 1) {
        if (index !== 6) {
            getCodeBoxElements(index + 1).focus();
        } else {
            getCodeBoxElements(index).blur();
            // Submit code
        }
    }
    if (eventCode === 8 && index !== 1) {
        getCodeBoxElements(index - 1).focus();
    }
}

function onFocusEvents(index) {
    for (kitem = 1; kitem <= index; kitem++) {
        const currentElement = getCodeBoxElements(kitem);
        if (!currentElement.value) {
            currentElement.focus();
            break;
        }
    }
}

/*OTP button disabled validation*/
$(document).ready(function() {
    const $inputs = $(".passcode-wrapper-main input");
    const $submitButton = $("#validateOTP");
    // $('#validateOTP').addClass("disable");
    function checkInputs() {
        // Check if all inputs are filled
        const allFilled = $inputs.toArray().every(input => $(input).val().trim().length === 1);
        if (allFilled) {
            $submitButton.removeClass("disable");
        } else {
            $submitButton.addClass("disable");
        }
    }

    // Attach event listener to each input
    $inputs.on("input", checkInputs);
});
/*OTP button disabled validation*/
/*login modal otp validation js*/

/*Profile Signup button disabled validation*/
$(document).ready(function() {
    $('body #FullName').on('input', function() {
        // Check if the input field has any text
        if ($.trim($(this).val()) !== '') {
            $('.submit_btn').removeClass('disable').prop('disabled', false);
        } else {
            $('.submit_btn').addClass('disable').prop('disabled', true);
        }
    });
});
/*Profile Signup button disabled validation*/

if (window.location.pathname == '/') {
    localStorage.removeItem('orderType');
    localStorage.setItem('orderType', 1);
    var citySelected = $("#citySelector").val();
    if (citySelected) {
        $("#citySelector").val("");
    }
}


function changeDelivery() {
    localStorage.setItem('orderType', 1);
    orderType = 1;
    $('.divNav').hide();
    $('#delivery-tab').addClass('active');
    $('input[name="optradio"]:checked').val();
    $('#pickup-tab').removeClass('active');
    $('#inCarTag').removeClass('active');
    $('#dineInTag').removeClass('active');
    $('#dine-in-tab').removeClass('active');
    $('#car-tab').removeClass('active');
    $('#pickup').removeClass('show active');
    $('#delivery').addClass('show active');
    $('#nav-home').show();
    $('#nav-home').attr("style", "display: flex");
    $('#nav-mobile-home').show();
    $('#deliveryLi').show();
    $('#slot_type_now').html(`Delivery Slot`);
    $('#slot_type_later').text(`Delivery Slot`);
    $('#selectslot').text('Select Delivery Slot');
    $('#bogoModalTitle').text('Choose delivery timings');
    $('#slotModal .slot-option-txt').text('Deliver');
    $('#chk_del').attr("style", "display: inline-block");
    $('#chk_pickup').attr("style", "display: none");
    $('#chk_dine').attr("style", "display: none");
    $('#chk_incar').attr("style", "display: none");
    $('#textlocationmodal').html('');
    $('#textlocationmodal').html('Enter the delivery location');
    if (window.location.href.indexOf("checkout") > -1) {
        add_to_cart();
    }
}

function selectPickUp() {

    orderType = 2;
    $('.order-type a').removeClass('active');
    localStorage.setItem('orderType', orderType);
    $('#addAddressDiv').hide();
    $('input[name="optradio"]:checked').val();
    $('.divNav').hide();
    $('#nav-profile').attr("style", "display: flex");
    $('.navtb').removeClass('active');
    $('#delivery-tab').removeClass('active');
    $('#pickup-tab').addClass('active');
    $('#dine-in-tab').removeClass('active');
    $('#car-tab').removeClass('active');
    $('#pickup').addClass('active');
    $('#delivery').removeClass('active');
    $('#dineInTag').removeClass('active');
    $('#inCarTag').removeClass('active');
    $('#slot_type_now').html(`Pickup Slot`);
    $('#slot_type_later').text(`Pickup Slot`);
    $('#selectslot').text('Select Pickup Slot');
    $('#bogoModalTitle').text('Choose pickup timings');
    $('#slotModal .slot-option-txt').text('Pickup');
    $('#pickup-tab').tab('show');
    $('#pickup').addClass('show active');
    $('#delivery').removeClass('show active');
    $('#freedel').attr("style", "display: none");
    $('#amountdel').attr("style", "display: none");
    $('#chk_pickup').attr("style", "display: inline-block");
    $('#chk_del').attr("style", "display: none");
    $('#chk_dine').attr("style", "display: none");
    $('#chk_incar').attr("style", "display: none");
    $('#textlocationmodal').html('');
    $('#textlocationmodal').html('Enter the pickup location');
    if (window.location.href.indexOf("checkout") > -1) {
        add_to_cart();
    }

}

function changeDineIn() {
    orderType = 3;
    $('.order-type a').removeClass('active');
    localStorage.setItem('orderType', orderType);
    $('input[name="optradio"]:checked').val();
    $('.divNav').hide();
    $('#addAddressDiv').hide();
    $('.navtb').removeClass('active');
    $('#nav-contact').attr("style", "display: flex");
    $('#delivery-tab').removeClass('active');
    $('#pickup-tab').removeClass('active');
    $('#dine-in-tab').addClass('active');
    $('#car-tab').removeClass('active');
    $('#pickup').removeClass('active');
    $('#delivery').removeClass('active');
    $('#dineInTag').addClass('active');
    $('#inCarTag').removeClass('active');
    $('#dine-in-tab').tab('show');
    $('#freedel').attr("style", "display: none");
    $('#amountdel').attr("style", "display: none");
    $('#tabNOSelected').show();
    $('#select_table').show();
    // $('#selecttable').show();
    $('#tabNO').hide();
    $('#chk_dine').attr("style", "display: inline-block");
    $('#chk_pickup').attr("style", "display: none");
    $('#chk_del').attr("style", "display: none");
    $('#chk_incar').attr("style", "display: none");
    if (window.location.href.indexOf("checkout") > -1) {
        add_to_cart();
    }
}

function changeInCar() {
    localStorage.setItem('orderType', 4);
    orderType = 4;
    $('.divNav').hide();
    $('#delivery-tab').removeClass('active');
    $('input[name="optradio"]:checked').val();
    $('#pickup-tab').removeClass('active');
    $('#addAddressDiv').hide();
    $('#dine-in-tab').removeClass('active');
    $('#car-tab').addClass('active');
    $('#pickup').removeClass('active');
    $('#delivery').removeClass('active');
    $('#dineInTag').removeClass('active');
    $('#inCarTag').addClass('active');
    $('#nav-car').attr("style", "display: flex");
    $('#slot_type_now').html(`Delivery Slot`);
    $('#slot_type_later').text(`Delivery Slot`);
    $('#selectslot').text('Select Delivery Slot');
    $('#bogoModalTitle').text('Choose delivery timings');
    $('#slotModal .slot-option-txt').text('Deliver');
    $('#chk_incar').attr("style", "display: inline-block");
    $('#chk_dine').attr("style", "display: none");
    $('#chk_pickup').attr("style", "display: none");
    $('#chk_del').attr("style", "display: none");
    $('#freedel').attr("style", "display: none");
    $('#amountdel').attr("style", "display: none");
    if (window.location.href.indexOf("checkout") > -1) {
        navigator.geolocation.getCurrentPosition(GetCoords, GetError);
        add_to_cart();
    }
}


/*footer sticky*/
function footerAlign() {
    $('footer').css('height', 'auto');
    var footerHeight = $('footer').outerHeight();
    $('body').css('padding-bottom', footerHeight);
    $('footer').css('height', footerHeight);
}
$(document).ready(function() {
    footerAlign();
});
$(window).resize(function() {
    footerAlign();
});
/*footer sticky*/

/*Inline Slick Slider Js*/
$(document).ready(function() {
    function mySlick(elems) {
        elems.each(function() {
            var current = $(this);
            let myOption = eval('({' + current.attr("data-option") + '})');
            // current.slick(myOption);
            current.not('.slick-initialized').slick(myOption);
        });
    }
    mySlick($("[data-slick]"));
});
/*Inline Slick Slider Js*/

$('#showRaiseConcern, #faqmodalneww').on('click', function(e) {
    $('body').removeClass('myBackground');
    $('.uengageoverlay').removeClass('active');
    $('.sidenav').removeClass('active');
    $('.newbtnspant').addClass('myDiv');
    $('.newbtnspant').removeClass('closebtn');
});


function openConcernList(pId) {
    if (localStorage.getItem('userdata') && localStorage.getItem('userdata') != null) {

        var pId = pId;
        var userData = JSON.parse(localStorage.getItem('userdata'));
        var contactMappingId = userData['contactMappingId'];

        var url = origin + "/support/getConcernType/" + contactMappingId + "/" + pId;

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(result) {

                if (result['status'] == 1) {
                    var list = '';

                    $.each(result['concern_types'], function(index, res) {

                        // list += '<div class="consern-list" id="'+ res['id'] +'" onclick="showConcernData('+ res['id'] +', \'' + res['name'].replace(/'/g, "\\'") + '\')">';
                        if (res['id'] == 9) {
                            list += '<div class="card" id="' + res['id'] + '"><div class="card-header"  id="headingOne"><h2 class="mb-0">	<button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"  onclick="showConcernData(' + res['id'] + ', \'' + res['name'].replace(/'/g, "\\'") + '\')">	<span>' + res['name'].replace(/'/g, "\\'") + '</span> <span><i class="las la-angle-down"></i></span></button></h2>	</div><div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample" style="">				<div class="card-body">	<p class="plight">We are really sorry for this experience. You can check refund status or raise a concern, we will try to resolve this as soon as possible.</p>	<div class="main-bg-oyt">						<div><div class="form-group showarrow mb-0" id="order_list" style="" onclick="showOrderListData(' + pId + ')"><label class="label-p">Your Order ID</label><div class="main-bg"><div class="input-group">	<input type="text" class="form-control" id="order-id" placeholder="Choose order from list" readonly >	</div>											</div></div></div><div class="text-center text-md-left mt-3 mt-md-0">			<button type="button" onclick ="submitConcern(' + pId + ')" class="btn btn-primary btn-next animatebtn">Submit</button></div>	</div></div>						</div>					</div>';
                        } else if (res['id'] == 10) {
                            list += `	<div class="card" id="` + res['id'] + `">
						<div class="card-header" id="headingTwo">
							<h2 class="mb-0">
								<button class="btn btn-link btn-block text-left collapsed" onclick="showConcernData(` + res['id'] + `, '` + res['name'].replace(/'/g, "\\'") + `');" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
								<span>` + res['name'] + `</span> <span><i class="las la-angle-down"></i></span>
								</button>
							</h2>
						</div>
						<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
							<div class="card-body">
								<p class="plight">We are really sorry for this experience. You can check refund status or raise a concern, we will try to resolve this as soon as possible.</p>
								<div class="main-bg-oyt">
									<div>
										<div class="form-group showarro0w mb-3" id="outlet_list" style="" onclick="showOutletListData(` + pId + `)">
											 <label class="label-p">Select Outlet</label>
											 <div class="main-bg">
												 <div class="input-group">
													<input type="text" class="form-control" id="select-outlet" placeholder="Outlet" readonly >
												 </div>
											 </div>
										</div>
										
										<div class="form-group mb-0" id="concern_comment" style="">
											 <div class="main-bg">
												 <div class="input-group">
													<textarea class="form-control" id="comments-text" placeholder="Comments" rows="4" cols="50" ></textarea>
												 </div>
											 </div>
										  </div>
									</div>
									<div class="text-center text-md-left mt-3 mt-md-0">
										<button type="button" onclick ="submitConcern(` + pId + `)" class="btn btn-primary btn-next animatebtn">Submit</button>
									</div>
								</div>
							</div>
						</div>
					</div>`;
                        } else if (res['id'] == 11) {
                            list += `<div class="card" id="` + res['id'] + `">
						<div class="card-header" id="headingThree">
							<h2 class="mb-0">
								<button onclick="showConcernData(` + res['id'] + `, '` + res['name'].replace(/'/g, "\\'") + `');" class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
								<span>` + res['name'] + `</span> <span><i class="las la-angle-down"></i></span>
								</button>
							</h2>
						</div>
						<div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
							<div class="card-body">
								<p class="plight">We are really sorry for this experience. You can check refund status or raise a concern, we will try to resolve this as soon as possible.</p>
								<div class="main-bg-oyt">
									<div>
										<div class="form-group mb-0" id="concern_comment" style="">
											 <label class="label-p">Add Comment</label>
											 <div class="main-bg">
												 <div class="input-group">
													<textarea id="comments" class="form-control" placeholder="Comments" rows="4" cols="50"></textarea>
												 </div>
                                     
											</div>
										</div>
									</div>
									<div class="text-center text-md-left mt-3 mt-md-0">
										<button type="button" onclick ="submitConcern(` + pId + `)"  class="btn btn-primary btn-next animatebtn">Submit</button>
									</div>
								</div>
							</div>
						</div>
					</div>`;
                        }
                    });


                    $('#accordionExample').html('');
                    $('#accordionExample').html(list);
                } else {
                    $('#other-inputs').modal('hide');
                }
            }

        });
    }

}

function showConcernData(id, name) {

    if (id == 9) {
        $('#order_list').show();
        $('#outlet_list').hide();
        $('#concern_comment').hide();
        $('#refund-status').val(name);
        $('#concern-type-id').val(id);
        $('#other-inputs').modal('hide');
        $('#error-msg-concern').hide();
    } else if (id == 10) {
        $('#order_list').hide();
        $('#outlet_list').show();
        $('#concern_comment').show();
        $('#refund-status').val(name);
        $('#concern-type-id').val(id);
        $('#other-inputs').modal('hide');
        $('#error-msg-concern').hide();
    } else if (id == 11) {
        $('#order_list').hide();
        $('#outlet_list').hide();
        $('#concern_comment').show();
        $('#refund-status').val(name);
        $('#concern-type-id').val(id);
        $('#other-inputs').modal('hide');
        $('#error-msg-concern').hide();
    }
}

function showOrderListData(pId) {

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var mobile = userData['mobile'];
    var action = 'close_order';
    var params = 'mobile=' + mobile + '&parentBusinessId=' + pId + '&contactMappingId=' +
        contactMappingId + '&businessId=' + pId + '&token=' + token + '&action=' + action;
    var url = '' + origin + '/pay/getOrderInfo?' + params;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['rows'].length > 0) {
                if (result['status'] == 1) {

                    var list = '';
                    $('#othertype_title').html("Select Order");
                    if (result['rows'].length > 0) {
                        $('#order_list').show();
                        $.each(result['rows'], function(index, res) {

                            list += '<div class="consern-list" id="' + res['id'] + '" onclick="selectOrderData(' + res['id'] + ')">';
                            list += '<div>';
                            list += '<b> #' + res['id'] + '</b>';
                            list += '<p class="mb-0">';
                            list += res['locality'];
                            list += '</p>';
                            list += '<span style="color: #7b7b7b;">';
                            list += res['startTime'];
                            list += '</span>';
                            list += '</div>';
                            list += '<div>';
                            list += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">';
                            list += '<path fill-rule="evenodd" clip-rule="evenodd" d="M18.75 6C18.75 5.58579 18.4142 5.25 18 5.25H9C8.58579 5.25 8.25 5.58579 8.25 6C8.25 6.41421 8.58579 6.75 9 6.75H16.1893L5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L17.25 7.81066V15C17.25 15.4142 17.5858 15.75 18 15.75C18.4142 15.75 18.75 15.4142 18.75 15V6Z" fill="#1C274C"/>';
                            list += '</svg>';
                            list += '</div>';
                            list += '</div>';
                        });


                        $('#concern_type').html('');
                        $('#concern_type').html(list);
                        $('#other-inputs').modal('show');
                        $('#error-msg-concern').hide();
                    } else {
                        $('#other-inputs').modal('hide');
                        $('#error-msg-concern').html("No Past Orders Found!");
                        $('#error-msg-concern').show();
                        $('#order_list').hide();
                    }

                } else {
                    $('#other-inputs').modal('hide');
                    $('#error-msg-concern').html(result['msg']);
                    $('#error-msg-concern').show();
                }

            } else {
                $('#promonotapplied').modal('show');

                $('#promonotmsg').html(`No orders yet! Why not start by placing one?`);
                setTimeout(() => {
                    $('#promonotapplied').modal('hide');

                }, 2500);
                return;
            }
        }
    });
}

function showOutletListData(pId) {

    var pId = pId;
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var mobile = userData['mobile'];

    var url = origin + "/client/getAllStores/" + pId + "?mobile=" + mobile;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        headers: {
            'token': userData['token']
        },
        success: function(result) {

            if (result['status'] == 1) {

                var list = '';
                $('#othertype_title').html("Select Outlet");
                $.each(result['stores'], function(index, res) {

                    list += '<div class="consern-list" id="' + res['id'] + '" onclick="selectOutletData(\'' + res['locality'].replace(/'/g, "\\'") + '\' , \'' + res['city'].replace(/'/g, "\\'") + '\')">';
                    list += '<div>';
                    list += res['locality'] + ',' + res['city'];
                    list += '</div>';
                    list += '<div>';
                    list += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">';
                    list += '<path fill-rule="evenodd" clip-rule="evenodd" d="M18.75 6C18.75 5.58579 18.4142 5.25 18 5.25H9C8.58579 5.25 8.25 5.58579 8.25 6C8.25 6.41421 8.58579 6.75 9 6.75H16.1893L5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L17.25 7.81066V15C17.25 15.4142 17.5858 15.75 18 15.75C18.4142 15.75 18.75 15.4142 18.75 15V6Z" fill="#1C274C"/>';
                    list += '</svg>';
                    list += '</div>';
                    list += '</div>';
                });


                $('#concern_type').html('');
                $('#concern_type').html(list);
                $('#other-inputs').modal('show');
                $('#error-msg-concern').hide();

            } else {
                $('#other-inputs').modal('hide');
                $('#error-msg-concern').html(result['msg']);
                $('#error-msg-concern').show();
            }
        }
    });

}

function selectOutletData(locality, city) {
    $('#select-outlet').val(locality + '-' + city);
    $('#other-inputs').modal('hide');
}

function selectOrderData(id) {
    $('#order-id').val(id);
    $('#other-inputs').modal('hide');
}

function submitConcern(pId) {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var concernType = $('#concern-type-id').val();
    // Collecting the concern details

    if (concernType == 9) {
        var concernDetails = [
            $('#order-id').val(),
        ];
        if ($('#order-id').val() == '' || $('#order-id').val() == null) {
            $('#promonotapplied').modal('show');

            $('#promonotmsg').html(`<p>Please select an Order ID.</p>`);
            setTimeout(() => {
                $('#promonotapplied').modal('hide');

            }, 2000);
            return;
        }
    } else if (concernType == 10) {
        var concernDetails = [
            $('#select-outlet').val(),
            $('#comments-text').val()
        ];
        if ($('#select-outlet').val() == '' || $('#select-outlet').val() == null) {
            $('#promonotapplied').modal('show');

            $('#promonotmsg').html(`<p>Please select an outlet.</p>`);
            setTimeout(() => {
                $('#promonotapplied').modal('hide');

            }, 2000);
            return;
        }
        if ($('#comments-text').val() == '' || $('#comments-text').val() == null) {
            $('#promonotapplied').modal('show');

            $('#promonotmsg').html(`<p>Please add a comment.</p>`);
            setTimeout(() => {
                $('#promonotapplied').modal('hide');

            }, 2000);
            return;
        }
    } else if (concernType == 11) {
        var concernDetails = [
            $('#comments').val()
        ];
        if ($('#comments').val() == '' || $('#comments').val() == null) {
            $('#promonotapplied').modal('show');

            $('#promonotmsg').html(`<p>Please add a comment.</p>`);
            setTimeout(() => {
                $('#promonotapplied').modal('hide');

            }, 2000);
            return;
        }
    }

    // Convert the array to a comma-separated string
    var concernDetailsString = concernDetails.join(', ');

    var url = origin + "/support/raiseConcern/" + pId + "/" + contactMappingId;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        data: {
            token: token,
            concernType: concernType,
            concern_details: concernDetailsString
        },
        success: function(result) {
            if (result['status'] == 1) {
                // Handle success
                $('#promoapplied').modal('show');
                $('.promors').html(result['msg']);
                setTimeout(function() {
                    $('#promoapplied').modal('hide');
                    $('#raseaconcern').modal('hide');
                    var form = $('#raise_concernform')[0];
                    form.reset();

                    // Reset checkboxes, radio buttons, and select options
                    $(form).find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
                    $(form).find('select').prop('selectedIndex', 0);

                    // Reset any additional elements
                    $('#error-msg-concern').hide();
                    $('#refund-status').val('');
                    $('#order_list').hide();
                    $('#outlet_list').hide();
                    $('#concern_comment').hide();
                }, 2500);
            } else {
                // Handle error
                $('#promonotapplied').modal('show');

                $('#promonotmsg').html(`${result['msg']}`);

                setTimeout(() => {
                    $('#promonotapplied').modal('hide');

                }, 2000);
                return;

            }
        },
        error: function(xhr, status, error) {
            console.error('Error occurred:', error);
        }
    });
}



$('#raseaconcern').on('show.bs.modal', function() {
    var form = $('#raise_concernform')[0];
    form.reset();
    openConcernList(pId);
    $(form).find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
    $(form).find('select').prop('selectedIndex', 0);
    $('#error-msg-concern').hide();
    $('#refund-status').val('');
    // $('#order_list').hide();
    // $('#outlet_list').hide();
    // $('#concern_comment').hide();
});

$('#raseaconcern').on('hide.bs.modal', function() {
    var form = $('#raise_concernform')[0];
    form.reset();

    $(form).find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
    $(form).find('select').prop('selectedIndex', 0);
    $('#error-msg-concern').hide();
    $('#refund-status').val('');
    // $('#order_list').hide();
    // $('#outlet_list').hide();
    // $('#concern_comment').hide();
});

/*himanshu 20-11-24 customization modal js*/
if ($(window).width() <= 991) {
    $('.ride-side-move').append($('.right-side-modal'));
}
$('#customisable-item-modal .modal-body').scroll(function() {
    if ($(window).width() < 991) {
        if ($(this).scrollTop() > 0) {
            $('.fixedbackbtnsupper').addClass("whiteline");
        } else {
            $('.fixedbackbtnsupper').removeClass("whiteline");
        }
    }
});
$('#single-item-modal .modal-body').scroll(function() {
    if ($(this).scrollTop() > 0) {
        $('.fixedbackbtnsupper').addClass("whiteline");
    } else {
        $('.fixedbackbtnsupper').removeClass("whiteline");
    }
});

/*IN THE CASE OF NESTED MODAL MAKE BODY NON SCROLLABLE*/
$(document).on('shown.bs.modal', function() {
    $('body').addClass('modal-open');
});

$(document).on('hidden.bs.modal', function() {
    if ($('.modal.show').length === 0) {
        $('body').removeClass('modal-open');
    }
});
/*IN THE CASE OF NESTED MODAL MAKE BODY NON SCROLLABLE*/

/*IN THE CASE OF IOS WHEN ENTER NUMBER ON OTP THROUGH KEYBOAD PAGE IS BOUNCING*/
/*IN THE CASE OF IOS WHEN ENTER NUMBER ON OTP THROUGH KEYBOAD PAGE IS BOUNCING*/

/*himanshu 20-11-24 customization modal js*/
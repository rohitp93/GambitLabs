(function () {

    var app = angular.module('app', []);

    app.controller('myCtrl', function ($scope, $http) {

        var url = "http://tuftuf.gambitlabs.fi/feed.txt";
        var regs = [];

        $scope.regs = regs;

 /*       $scope.httpGet = function()
        {
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange=function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    createDiv(xmlhttp.responseText);
                }
            };
            xmlhttp.open("GET", "http://tuftuf.gambitlabs.fi/feed.txt", false);
            xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            xmlhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
            xmlhttp.send();
        };

        function createDiv(responsetext)
        {
            var _body = document.getElementsByTagName('body')[0];
            var _div = document.createElement('div');
            _div.innerHTML = responsetext;
            _body.appendChild(_div);
        }*/


        jQuery.ajax = (function(_ajax){

            var protocol = location.protocol,
                hostname = location.hostname,
                exRegex = RegExp(protocol + '//' + hostname),
                YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
                query = 'select * from html where url="{URL}" and xpath="*"';

            function isExternal(url) {
                return !exRegex.test(url) && /:\/\//.test(url);
            }

            return function(o) {

                var url = o.url;

                if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

                    // Manipulate options so that JSONP-x request is made to YQL

                    o.url = YQL;
                    o.dataType = 'json';

                    o.data = {
                        q: query.replace(
                            '{URL}',
                            url + (o.data ?
                            (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                                : '')
                        ),
                        format: 'xml'
                    };

                    // Since it's a JSONP request
                    // complete === success
                    if (!o.success && o.complete) {
                        o.success = o.complete;
                        delete o.complete;
                    }

                    o.success = (function(_success){
                        return function(data) {

                            if (_success) {
                                // Fake XHR callback.
                                _success.call(this, {
                                    responseText: data.results[0]
                                    // YQL screws with <script>s
                                    // Get rid of them
                                        .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                                }, 'success');
                            }

                        };
                    })(o.success);

                }

                return _ajax.apply(this, arguments);

            };

        })(jQuery.ajax);


        $.ajax({
            url: url,
            type: 'GET',
            success: response
        });

        function response(res) {
            $scope.text = res.responseText;
            $scope.regs = $scope.text.split("\n");

            $scope.real4("1:15568","2:16611");
            $scope.integer("92:806");
            $scope.long("21:65480","22:65535");
        }

        $scope.real4 = function(a,b) {

            var bin32 = $scope.split2(a,b);
            var exp_arr = [];

            for (var l=1;l<=8;l++){
                exp_arr[l-1] = bin32[l];
                var exp = exp_arr.join("");
            }

            exp = parseInt(exp,2) - 127;

            var man = 0;
            for (l=9;l<=31;l++) {
                man = man + ((1/Math.pow(2,(l-8))) * bin32[l]);
            }

            man = 1 + man;

            if (bin32[0] == '1') {
                var send = (Math.pow(2,exp)) * man * -1;
            }
            else {
                send = (Math.pow(2,exp)) * man;
            }
            return send;
        };

        $scope.integer = function(a) {
            var integer = $scope.split1(a);
            var last8 = [];
            for (var l=7;l<=15;l++) {
                last8[l-8] = integer[l];
            }
            last8 = last8.join("");
            last8 = parseInt(last8,2);
            return last8;
        };

        $scope.long = function (a,b) {

            var long32 = $scope.split2(a,b);
            console.log(parseFloat(long32,2));

        }

        $scope.split2 = function (a,b) {

            var first_reg = (a.split(":"));
            var second_reg = (b.split(":"));

            var first = (first_reg[1] >> 0).toString(2);
            var second = (second_reg[1] >> 0).toString(2);

            var first16 = $scope.zeroes(first);
            var second16 = $scope.zeroes(second);

            var bin32 = second16.concat(first16);
            return bin32;
        }

        $scope.split1 = function (a) {

            var first_reg = (a.split(":"));
            var first = (first_reg[1] >> 0).toString(2);
            var first16 = $scope.zeroes(first);
            return first16;
        }

        $scope.zeroes = function (num) {

            if (num.length != 16) {
                var i = 16 - num.length;
                var zero = "";

                for (var k = 0; k < i; k++) {
                    zero = "0".concat(zero);
                }
                return zero.concat(num)
            }
        }




        })
}());
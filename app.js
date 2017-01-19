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
        }

        $scope.real4 = function(a,b) {

            var first_reg = (a.split(":"));
            var second_reg = (b.split(":"));

            var first = (first_reg[1] >> 0).toString(2);
            var second = (second_reg[1] >> 0).toString(2);

            console.log(first.length);

            if (first.length != 16) {

                var i = 16 - first.length;

                for (k=0;k<=i;k++){

                }

            }

            //var combined = ((first[1] >> 0).toString(2)) + ((second[1] >> 0).toString(2));

        }




        })
}());
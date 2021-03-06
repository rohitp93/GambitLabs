(function () {

    var app = angular.module('app', []);

    app.controller('myCtrl', function ($scope) {

        var url = "http://tuftuf.gambitlabs.fi/feed.txt";

        // Ajax request for feed.txt data
        // Uses Yahoo api to avoid CORS(Cross origin resource sharing) issue
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

                    if (!o.success && o.complete) {
                        o.success = o.complete;
                        delete o.complete;
                    }

                    o.success = (function(_success){
                        return function(data) {

                            if (_success) {

                                _success.call(this, {
                                    responseText: data.results[0]

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

        // Handles the response
        function response(res) {

            $scope.regs = res.responseText;
            $scope.regs = $scope.regs.split("\n");

            //To put metre cube in Flow rate units
            var fr_unit = '3';

            //To show language given by 96th register
            if ($scope.integer($scope.regs[96]) > 0) {
                var lang = "English";
            }
            else {
                lang = "Chinese";
            }

            // All the Metrics in one object with their processed values
            $scope.data = {
                'Flow Rate':[$scope.real4($scope.regs[1],$scope.regs[2]) + '  m' + fr_unit.sup() + '/h'],
                'Energy Flow Rate':[$scope.real4($scope.regs[3],$scope.regs[4]) + '  GJ/h'],
                'Velocity':[$scope.real4($scope.regs[5],$scope.regs[6]) + '  m/s'],
                'Fluid sound speed':[$scope.real4($scope.regs[7],$scope.regs[8]) + '  m/s'],
                "Positive accumulator":[$scope.long($scope.regs[9],$scope.regs[10])],
                "Positive decimal fraction":[$scope.real4($scope.regs[11],$scope.regs[12])],
                "Negative accumulator":[$scope.long($scope.regs[13],$scope.regs[14])],
                "Negative decimal fraction":[$scope.real4($scope.regs[15],$scope.regs[16])],
                "Positive energy accumulator":[$scope.long($scope.regs[17],$scope.regs[18])],
                "Positive energy decimal fraction":[$scope.real4($scope.regs[19],$scope.regs[20])],
                "Negative energy accumulator":[$scope.long($scope.regs[21],$scope.regs[22])],
                "Negative energy decimal fraction":[$scope.real4($scope.regs[23],$scope.regs[24])],
                "Net accumulator":[$scope.long($scope.regs[25],$scope.regs[26])],
                "Net decimal fraction":[$scope.real4($scope.regs[27],$scope.regs[28])],
                "Net energy accumulator":[$scope.long($scope.regs[29],$scope.regs[30])],
                "Net energy decimal fraction":[$scope.real4($scope.regs[31],$scope.regs[32])],
                "Temperature #1/inlet":[$scope.real4($scope.regs[33],$scope.regs[34]) + "C"],
                "Temperature #2/outlet":[$scope.real4($scope.regs[35],$scope.regs[36]) + "C"],
                "Analog input AI3":[$scope.real4($scope.regs[37],$scope.regs[38])],
                "Analog input AI4":[$scope.real4($scope.regs[39],$scope.regs[40])],
                "Analog input AI5":[$scope.real4($scope.regs[41],$scope.regs[42])],
                "Current input at AI3":[$scope.real4($scope.regs[43],$scope.regs[44]) + "  mA"],
                "Current input at AI4":[$scope.real4($scope.regs[45],$scope.regs[46]) + "  mA"],
                "Current input at AI5":[$scope.real4($scope.regs[47],$scope.regs[48]) + "  mA"],
                "System password":[$scope.bcd($scope.regs[49]) + $scope.bcd($scope.regs[50])],
                "Password for hardware":[$scope.bcd($scope.regs[51])],
                "Calendar (date and time)":[$scope.bcd($scope.regs[54]) + $scope.bcd($scope.regs[53]) + $scope.bcd($scope.regs[55])],
                "Day+Hour for Auto-Save":[$scope.bcd($scope.regs[56])],
                "Key to input":[$scope.integer($scope.regs[59])],
                "Go to Window":[$scope.integer($scope.regs[60])],
                "LCD Back-lit lights for number of seconds":[$scope.integer($scope.regs[61])],
                "Times for the beeper":[$scope.integer($scope.regs[62])],
                "Pulses left for OCT":[$scope.integer($scope.regs[62])],
                "Error code":[$scope.bit($scope.regs[72])],
                "PT100 resistance of inlet":[$scope.real4($scope.regs[77],$scope.regs[78]) + "  Ohm"],
                "PT100 resistance of outlet":[$scope.real4($scope.regs[79],$scope.regs[80]) + "  Ohm"],
                "Total travel time":[$scope.real4($scope.regs[81],$scope.regs[82]) + "  Micro-sec"],
                "Delta travel time":[$scope.real4($scope.regs[83],$scope.regs[84]) + "  Nano-sec"],
                "Upstream travel time":[$scope.real4($scope.regs[85],$scope.regs[86]) + "  Micro-sec"],
                "Downstream travel time":[$scope.real4($scope.regs[87],$scope.regs[88]) + "  Micro-sec"],
                "Output current":[$scope.real4($scope.regs[89],$scope.regs[90]) + "  mA"],
                "Working step and Signal Quality":[$scope.integer($scope.regs[92])],
                "Upstream strength":[$scope.integer($scope.regs[93]) + "  (Range 0-2047)"],
                "Downstream strength":[$scope.integer($scope.regs[94]) + "  (Range 0-2047)"],
                "Language used in user interface":lang,
                "The rate of the measured travel time by the calculated travel time":[$scope.real4($scope.regs[97],$scope.regs[98]) + "  (Normal 100+-3%)"],
                "Reynolds number":[$scope.real4($scope.regs[99],$scope.regs[100])]
            };

            var keys = Object.keys($scope.data);

            //Create a html table to display in index.html
            var myTable= "<table align='center'><tr><th> Metric </th>";
            myTable+= "<th> Value </th>";

            for (var i=0; i<keys.length; i++) {
                myTable+="<tr><td>" + keys[i] + "</td>";
                myTable+="<td>" + $scope.data[keys[i]] + "</td>";
            }

            myTable+="</table>";
            document.getElementById('table').innerHTML = myTable;

        }

        // Function to handle real4 data type metrics
        $scope.real4 = function(a,b) {

            var bin16_a = $scope.split2(a);
            var bin16_b = $scope.split2(b);
            var bin32 = bin16_b.concat(bin16_a);
            var exp_arr = [];

            for (var l=1;l<=8;l++){
                exp_arr[l-1] = bin32[l];
            }
            var exp = exp_arr.join("");
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

        // Function to handle integer data type metrics
        $scope.integer = function(a) {
            var integer = $scope.split2(a);
            var last8 = [];
            for (var l=7;l<=15;l++) {
                last8[l-8] = integer[l];
            }
            last8 = last8.join("");
            last8 = parseInt(last8,2);
            return last8;
        };

        // Function to handle long data type metrics
        $scope.long = function (a,b) {

            var long16_a = $scope.split2(a);
            var long16_b = $scope.split2(b);
            var long32 = long16_b.concat(long16_a);
            return parseInt(long32,2) >> 0;
        };

        // Function to handle bit data type metrics
        $scope.bit = function (a) {

            var err_st = [" no received signal "," low received signal "," poor received signal ",
                " pipe empty "," hardware failure "," receiving circuits gain in adjusting "," frequency at the frequency output over flow ",
                " current at 4-20mA over flow "," RAM check-sum error "," main clock or timer clock error "," parameters check-sum error ",
                " ROM check-sum error "," temperature circuits error "," reserved "," Bit14 internal timer over flow "," analog input over range "];

            var err = $scope.split2(a);

            var err_arr = err.split('');
            err_arr = err_arr.reverse();

            var err_send = [];

            for(var i=0;i<=err_arr.length;i++) {
                if (err_arr[i] == 1) {
                    err_send.push(err_st[i]);
                }
            }
            return err_send;
        };

        // Function to handle BCD data type metrics
        $scope.bcd = function (a) {

            var bcd48 = $scope.split2(a);
            var bcd48_arr = [];

            for(var i=4;i<=16;i+=4) {
                 bcd48_arr.push(bcd48.slice(i-4,i));
                }

            for (var j=0;j<=3;j++) {
                    bcd48_arr[j] = parseInt(bcd48_arr[j],2);
                }

            return bcd48_arr.join('');

        };

        // Function to divide the register number and value and convert the value into 16bit binary
        $scope.split2 = function (a) {

            var first_reg = (a.split(":"));
            var first = (first_reg[1] >> 0).toString(2);

            if (first.length != 16) {
                var i = 16 - first.length;
                var zero = "";

                for (var k = 0; k < i; k++) {
                    zero = "0".concat(zero);
                }
                return zero.concat(first);
            }

            else
            {
                return first;
            }
        };


        })
}());
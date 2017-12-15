$(document).ready(function () {
    // This is for multiplexing under the test channel
    // If left blank, everything will be compressed into one server
    var namespace = '/test'

    var socket = io.connect('http://' + document.domain + ':' + location.port + '/test')

    socket.on('connect', function () {
        socket.emit('my_event', {data: "I'm connected!"})
    })

    socket.on('my response', function (msg) {
        $('#log').append('<br>' + $('<div/>').text('Received # ' + msg.count + ': ' + msg.data).html())
    })

    // A ping-pong test for testing server latency
    var ping_pong_times = []
    var start_time
    window.setInterval(function () {
        start_time = (new Date).getTime()
        socket.emit('my_ping')
    }, 1000)

    socket.on('my_pong', function () {
        var latency = (new Date).getTime() - start_time
        ping_pong_times.push(latency)
        ping_pong_times = ping_pong_times.slice(-30)
        var sum = 0
        for (var i = 0; i < ping_pong_times.length; i++) {
            sum += ping_pong_times[i]
        }
        $('#ping-pong').text(Math.round(10 * sum / ping_pong_times.length) / 10)
    })

    $('form#emit').submit(function (event) {
        socket.emit('my_event', {data: $('#emit_data').val()})
        return false
    })

    $('form#broadcast').submit(function (event) {
        socket.emit('my_broadcast_event', {data: $('#broadcast_data').val()})
        return false
    })

    $('form#join').submit(function (event) {
        socket.emit('join', {room: $('#join_room').val()})
        return false
    })

    $('form#leave').submit(function (event) {
        socket.emit('leave', {room: $('#leave_room').val()})
        return false
    })

    $('form#send_room'.submit(function (event) {
        socket.emit('my_room_event', {room: $('#room_name').val(), data: $('#room_data').val()})
        return false
    }))

    $('form#close').submit(function (event) {
        socket.emit('close_room', {room: $('#close_room').val()})
        return false
    })

    $('form#disconnect').submit(function (event) {
        socket.emit('disconnect_request')
        return false
    })
})
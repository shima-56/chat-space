$(document).on('turbolinks:load',function(){
  function buildHTML(message){
      var img = (message.image.url !== null) ? `<img src="${ message.image.url }">`: '';
      var html = `<div class="message" data-message-id=${message.id}>
                    <div class="upper-message">
                        <div class="upper-message__user-name">
                            ${message.user_name}
                        </div>
                        <div class="upper-message__date">
                            ${message.date}
                        </div>
                    </div>
                      <div class="lower-message">    
                        <p class="lower-message__content">
                            ${message.content}
                        </p>
                            ${img}
                      </div>
                  </div>`
      return html;
      }
  $('#new_message').on('submit', function(e){
        e.preventDefault();
        var message = new FormData(this);
        var url = $(this).attr('action')
        $.ajax({
          url: url,
          type: "POST",
          data: message,
          dataType: 'json',
          processData: false,
          contentType: false
          })
        .done(function(data){
          var html = buildHTML(data);
          $('.messages').append(html);
          $('#new_message')[0].reset();
          $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
        })
        .fail(function(data){
          alert('エラーが発生しました。メッセージは送信できませんでした。');
        })
        .always(function(data){
          $('.form__submit').prop('disabled', false);　
        })
    })


      var reloadMessages = function() {
      if (window.location.href.match(/\/groups\/\d+\/messages/)){//今いるページのリンクが/groups/グループID/messagesのパスとマッチすれば以下を実行。
      var last_message_id = $('.message:last').data("message-id");
        $.ajax({
          url: "api/messages",
          type: 'get',
          dataType: 'json',
          data: {id: last_message_id}
        })
        .done(function(messages){
          var insertHTML = '';
            messages.forEach(function(message){
              insertHTML = buildHTML(message);
              if (last_message_id < message.id){
              $('.messages').append(insertHTML);
              $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
              }
            })
        })
        .fail(function(){
          alert("自動更新に失敗しました")
        });
      }
    };
  setInterval(reloadMessages, 5000);
});

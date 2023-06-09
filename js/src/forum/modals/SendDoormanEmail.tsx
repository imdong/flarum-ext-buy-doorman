import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from "flarum/common/components/Button";
import Stream from 'flarum/common/utils/Stream';

export default class SendDoormanEmail extends Modal {
  private email: Stream;

  constructor() {
    super();

    this.email = Stream();
  }

  className() {
    return 'store-buy Modal--small';
  }

  title() {
    return "购买邀请码";
  }

  content() {
    return (
      <div className="container buy-store-layer">
        <div className="Form">
          <div class="helpText">将花费 100 药丸，购买一个注册邀请码，并发送到“受邀人邮箱”中。</div>
          <div class="Form-group">
            <label for="buy-store-to-mail">受邀人邮箱</label>
            <div class="helpText">邀请码购买成功后，将通过邮件发送到受邀人邮箱中。</div>
            <input required id="buy-store-to-mail" class="FormControl" type="email" bidi={this.email}/>
          </div>
          {Button.component(
            {
              className: 'Button Button--primary',
              type: 'submit',
              loading: this.loading,
            },
            "购买 & 发送"
          )}
        </div>
      </div>
    );
  }

  onsubmit(e: Event) {
    e.preventDefault();
    this.loading = true;

    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/store/buy-doorman',
      body: {
        email: this.email(),
      }
    }).then(result => {
      console.log('result', result)

      // 关闭加载中状态
      this.loading = false
      app.alerts.show({
        type: "success",
      }, '发送成功');

      // 清空邮箱
      this.email('')

      // 关闭购买框
      this.hide()

      // 刷新用户余额(爱咋咋地 红就红吧 能跑就行)
      let money = app.session.user.attribute('money');
      console.log('money', money, result);
      app.session.user.pushAttributes({
        money: money - result.data.attributes.use_money,
      })
    });
  }

}

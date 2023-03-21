import { handleLogin } from '../controller/login';
import { login, loginQRCodeShow, settings } from '../shared';
import { SettingType } from '../types';
import { watch, watchEffectRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';
import { debounce } from '../utils/utils';

/**
 * @description 登录
 */
function LoginItem() {
  return watchEffectRef(() => {
    return login.value
      ? undefined
      : createElementNode(
          'div',
          undefined,
          {
            class: 'egg_login_item',
          },
          [
            // 登录按钮
            createElementNode(
              'button',
              undefined,
              {
                type: 'button',
                class: 'egg_login_btn',
                onclick: debounce(async () => {
                  // 开始登录
                  handleLogin();
                }, 300),
              },
              createTextNode('扫码登录')
            ),
            // 窗口
            createElementNode(
              'div',
              undefined,
              {
                class: watchEffectRef(
                  () =>
                    `egg_login_img_wrap${
                      loginQRCodeShow.value ? ' active' : ''
                    }`
                ),
              },
              createElementNode('img', undefined, {
                class: 'egg_login_img',
              })
            ),
          ],
          {
            onMounted() {
              watch(
                () => settings[SettingType.SCHEDULE_RUN],
                () => {
                  // 未开启定时展示二维码
                  if (!settings[SettingType.SCHEDULE_RUN]) {
                    // 开始登录
                    handleLogin();
                  }
                },
                true
              );
            },
          }
        );
  });
}

export { LoginItem };

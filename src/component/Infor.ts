import { getUserInfo } from '../api/user';
import { autoRefreshQRCodeInterval } from '../config/task';
import { refreshLoginQRCode } from '../controller/login';
import { mainStore } from '../store';
import { SettingType } from '../types';
import { debounce } from '../utils';
import { $$, createElementNode, createTextNode } from '../utils/element';

/**
 * @description 信息
 * @returns
 */
async function Info({ login }: { login: boolean }) {
  if (login) {
    // 用户信息
    const userInfo = await getUserInfo();
    if (userInfo) {
      const { avatarMediaUrl, nick } = userInfo;
      return createElementNode(
        'div',
        undefined,
        {
          class: 'egg_user_wrap',
        },
        [
          // 用户信息
          createElementNode('div', undefined, { class: 'egg_userinfo' }, [
            // 头像
            createElementNode(
              'div',
              undefined,
              { class: 'egg_avatar' },
              avatarMediaUrl
                ? createElementNode('img', undefined, {
                    src: avatarMediaUrl,
                    class: 'egg_avatar_img',
                  })
                : createElementNode(
                    'div',
                    undefined,
                    {
                      class: 'egg_sub_nickname',
                    },
                    createTextNode(nick.substring(1, 3))
                  )
            ),
            // 昵称
            createElementNode(
              'div',
              { innerText: nick },
              { class: 'egg_nick' }
            ),
          ]),
          // 退出按钮
          createElementNode(
            'button',
            { innerText: '退出' },
            {
              type: 'button',
              class: 'egg_login_btn',
              onclick: debounce(() => {
                const logged = $$("a[class='logged-link']")[0];
                logged && logged.click();
              }, 500),
            }
          ),
        ]
      );
    }
  }
  // 用户登录
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_login_wrap',
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
            // 刷新二维码
            refreshLoginQRCode();
            // 每隔 100s 刷新
            mainStore.refreshTimer = setInterval(() => {
              // 刷新二维码
              refreshLoginQRCode();
            }, autoRefreshQRCodeInterval);
          }, 500),
        },
        createTextNode('扫码登录')
      ),
      // 窗口
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_login_img_wrap',
        },
        createElementNode('img', undefined, {
          class: 'egg_login_img',
        })
      ),
    ]
  );
}

export { Info };

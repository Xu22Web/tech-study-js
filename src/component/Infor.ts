import { getUserInfo } from '../api/user';
import { startLogin } from '../controller/login';
import { mainStore } from '../store';
import { debounce } from '../utils/utils';
import { watchEffectRef } from '../utils/composition';
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
              undefined,
              { class: 'egg_nick' },
              createTextNode(nick)
            ),
          ]),
          // 退出按钮
          createElementNode(
            'button',
            undefined,
            {
              type: 'button',
              class: 'egg_login_btn',
              onclick: debounce(() => {
                const logged = $$("a[class='logged-link']")[0];
                logged && logged.click();
              }, 500),
            },
            createTextNode('退出')
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
            // 开始登录
            startLogin();
          }, 500),
        },
        createTextNode('扫码登录')
      ),
      // 窗口
      createElementNode(
        'div',
        undefined,
        {
          class: watchEffectRef(
            mainStore.startLogin,
            () =>
              `egg_login_img_wrap${mainStore.startLogin.value ? ' active' : ''}`
          ),
        },
        createElementNode('img', undefined, {
          class: 'egg_login_img',
        })
      ),
    ]
  );
}

export { Info };

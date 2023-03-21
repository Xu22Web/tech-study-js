import { handleLogout } from '../controller/login';
import { refreshUserInfo } from '../controller/user';
import { login, userinfo } from '../shared';
import { watchEffectRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';
import { debounce } from '../utils/utils';

/**
 * @description 信息
 * @returns
 */
function InfoItem() {
  return watchEffectRef(() => {
    if (login.value) {
      return createElementNode(
        'div',
        undefined,
        {
          class: 'egg_info_item',
        },
        [
          // 用户信息
          createElementNode('div', undefined, { class: 'egg_userinfo' }, [
            // 头像
            createElementNode(
              'div',
              undefined,
              { class: 'egg_avatar' },
              watchEffectRef(() => {
                return [
                  userinfo.avatar
                    ? createElementNode('img', undefined, {
                        src: userinfo.avatar,
                        class: 'egg_avatar_img',
                      })
                    : createElementNode(
                        'div',
                        undefined,
                        {
                          class: 'egg_avatar_nick',
                        },
                        createTextNode(
                          watchEffectRef(() => userinfo.nick.substring(1, 3))
                        )
                      ),
                ];
              })
            ),
            // 昵称
            createElementNode(
              'div',
              undefined,
              { class: 'egg_nick' },
              createTextNode(watchEffectRef(() => userinfo.nick))
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
                // 退出登录
                handleLogout();
              }, 300),
            },
            createTextNode('退出')
          ),
        ],
        {
          onMounted() {
            // 刷新用户信息
            refreshUserInfo();
          },
        }
      );
    }
  });
}

export { InfoItem };

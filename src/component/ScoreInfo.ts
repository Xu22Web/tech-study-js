import { mainStore } from '../store';
import {
  $$,
  createElementNode,
  createNSElementNode,
  createTextNode,
} from '../utils/element';

/**
 * @description 分数详情
 */
function ScoreInfo({ login }: { login: boolean }) {
  if (login) {
    // 分数信息
    return createElementNode('div', undefined, { class: 'egg_scoreinfo' }, [
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_totalscore',
        },
        [
          createTextNode('总积分'),
          createElementNode('span', undefined, undefined, createTextNode(0)),
        ]
      ),
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_todayscore',
        },
        [
          createElementNode(
            'button',
            undefined,
            {
              type: 'button',
              class: 'egg_todayscore_btn',
              title: '查看分数详情',
              onclick: () => {
                const scoreDetails = $$('.egg_score_details')[0];
                if (scoreDetails) {
                  const exists = scoreDetails.classList.contains('hide');
                  scoreDetails.classList.toggle('hide', !exists);
                }
              },
              onblur: () => {
                // 积分详情
                const scoreDetails = $$('.egg_score_details')[0];
                if (scoreDetails) {
                  const exists = scoreDetails.classList.contains('hide');
                  if (!exists) {
                    scoreDetails.classList.add('hide');
                  }
                }
              },
            },
            [
              createTextNode('当天分数'),
              // 当天分数
              createElementNode(
                'span',
                undefined,
                undefined,
                createTextNode(0)
              ),
              // icon
              createNSElementNode(
                'svg',
                undefined,
                {
                  viewBox: '0 0 1024 1024',
                  class: 'egg_icon',
                },
                createNSElementNode('path', undefined, {
                  d: 'M332.16 883.84a40.96 40.96 0 0 0 58.24 0l338.56-343.04a40.96 40.96 0 0 0 0-58.24L390.4 140.16a40.96 40.96 0 0 0-58.24 58.24L640 512l-307.84 314.24a40.96 40.96 0 0 0 0 57.6z',
                })
              ),
              createElementNode(
                'div',
                undefined,
                {
                  class: 'egg_score_details hide',
                },
                [
                  createElementNode(
                    'div',
                    undefined,
                    { class: 'egg_score_title' },
                    [
                      createNSElementNode(
                        'svg',
                        undefined,
                        {
                          viewBox: '0 0 1024 1024',
                          class: 'egg_icon',
                        },
                        [
                          createNSElementNode('path', undefined, {
                            d: 'M314.81 304.01h415.86v58.91H314.81zM314.81 440.24h415.86v58.91H314.81z',
                          }),
                          createNSElementNode('path', undefined, {
                            d: 'M814.8 892.74h-8.64l-283.51-182-283.51 182h-8.64A69.85 69.85 0 0 1 160.72 823V188.22a69.85 69.85 0 0 1 69.77-69.77H814.8a69.85 69.85 0 0 1 69.77 69.77V823a69.85 69.85 0 0 1-69.77 69.74zM230.5 177.35a10.87 10.87 0 0 0-10.86 10.86V823a10.86 10.86 0 0 0 5 9.11l298.01-191.42 298.06 191.38a10.86 10.86 0 0 0 5-9.11V188.22a10.87 10.87 0 0 0-10.86-10.86z',
                          }),
                        ]
                      ),
                      createElementNode(
                        'div',
                        undefined,
                        {
                          class: 'egg_score_title_text',
                        },
                        createTextNode('积分详情')
                      ),
                    ]
                  ),
                  ...mainStore.tasks.map((task) =>
                    createElementNode(
                      'div',
                      undefined,
                      { class: 'egg_score_item' },
                      [
                        createTextNode(task.title),
                        createElementNode(
                          'span',
                          { innerText: task.currentScore },
                          {
                            class: 'egg_score_detail',
                          }
                        ),
                      ]
                    )
                  ),
                ]
              ),
            ]
          ),
        ]
      ),
    ]);
  }
}

export { ScoreInfo };

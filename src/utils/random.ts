/**
 * @description 点
 */
type Point = { x: number; y: number };

/**
 * @description 范围
 */
type Bounds = { x: number; y: number; width: number; height: number };
/**
 * @description 创建随机点
 * @param bounds 范围
 * @returns
 */
function createRandomPoint(bounds: Bounds): Point {
  // 范围
  const { x, y, width, height } = bounds;
  // 横坐标
  const randX = x + Math.random() * width * 0.5 + width * 0.25;
  // 纵坐标
  const randY = y + Math.random() * height * 0.5 + height * 0.25;
  return {
    x: randX,
    y: randY,
  };
}

/**
 * @description 生成随机路径
 * @param start
 * @param end
 * @param steps
 * @returns
 */
function createRandomPath(start: Point, end: Point, steps: number) {
  // 最小水平增量
  const minDeltaX = (end.x - start.x) / steps;
  // 最大垂直增量
  const maxDeltaY = (end.y - start.y) / steps;

  const path: Point[] = [];
  // 开始节点
  path.push(start);
  // 插入点
  for (let i = 0; i < steps; i++) {
    // 横坐标
    const x = path[i].x + Math.random() * 5 + minDeltaX;
    // 纵坐标
    const y =
      path[i].y +
      Math.random() * 5 * Math.pow(-1, ~~(Math.random() * 2 + 1)) +
      maxDeltaY;
    path.push({
      x,
      y,
    });
  }
  return path;
}
/**
 * @description 随机数字
 * @returns
 */
function generateNumAsChar(): string {
  return (~~(Math.random() * 10)).toString();
}
/**
 * @description 随机大写字母
 * @returns
 */
function generateUpperAsChar(): string {
  return String.fromCharCode(~~(Math.random() * 26) + 65);
}
/**
 * @description 随机小写字母
 * @returns
 */
function generateLowerAsChar(): string {
  return String.fromCharCode(~~(Math.random() * 26) + 97);
}
/**
 * @description 随机混合字符
 * @param length
 * @returns
 */
function generateMix(length: number = 6): string {
  // 随机字符串
  const randomText: string[] = [];
  // 生成器
  const typeGenerator: (() => string)[] = [
    generateNumAsChar,
    generateUpperAsChar,
    generateLowerAsChar,
  ];
  if (length) {
    for (let i = 0; i < length; i++) {
      // 随机位置
      const randomIndex = ~~(Math.random() * typeGenerator.length);
      randomText.push(typeGenerator[randomIndex]());
    }
  }
  return randomText.join('');
}

export { createRandomPoint, createRandomPath, generateMix };

/**
 * Classe que representa uma entidade animada.
 * Estende a classe `Entity` e adiciona suporte para animações.
 */
export default class AnimatedEntity extends Entity {
  /**
   * Cria uma nova entidade animada.
   * @param {number} [x=0] - A posição X inicial da entidade.
   * @param {number} [y=0] - A posição Y inicial da entidade.
   * @param {Object|null} [animations=null] - Um conjunto de animações a serem usadas pela entidade.
   */
  constructor(x = 0, y = 0, animations = null) {
    super(x, y);
    /** @type {AnimationManager|null} Gerenciador de animações da entidade. */
    this.animationManager = animations ? new AnimationManager(animations) : null;
    /** @type {boolean} Indica se a animação deve ser espelhada horizontalmente. */
    this.flipX = false;
  }

  /**
   * Inicializa o gerenciador de animações com um conjunto de animações.
   * @param {Object} animations - O conjunto de animações a serem usadas.
   */
  initializeAnimations(animations) {
    this.animationManager = new AnimationManager(animations);
  }

  /**
   * Atualiza a animação atual, caso um gerenciador de animações esteja presente.
   */
  updateAnimation() {
    if (this.animationManager) {
      this.animationManager.updateAnimation();
    }
  }

  /**
   * Obtém a animação atualmente em execução.
   * @returns {Object|null} A animação atual ou `null` se não houver animação ativa.
   */
  getCurrentAnimation() {
    return this.animationManager ? this.animationManager.getCurrentAnimation() : null;
  }

  /**
   * Define a animação a ser exibida com base no estado fornecido.
   * @param {string} state - O estado da animação a ser definido.
   */
  setAnimation(state) {
    if (this.animationManager) {
      this.animationManager.setAnimation(state);
    }
  }

  /**
   * Atualiza o estado da entidade e sua animação.
   */
  update() {
    super.update();
    this.updateAnimation();
  }
}

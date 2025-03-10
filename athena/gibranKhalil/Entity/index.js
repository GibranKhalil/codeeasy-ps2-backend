/**
 * Classe base para todas as entidades.
 * Define uma posição inicial e métodos que devem ser implementados pelas subclasses.
 */
export default class Entity {
    /**
     * Cria uma nova entidade.
     * @param {number} [x=0] - A posição X inicial da entidade.
     * @param {number} [y=0] - A posição Y inicial da entidade.
     */
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  
    /**
     * Atualiza o estado da entidade.
     * Este método deve ser implementado nas subclasses, caso for utilizado.
     * @throws {Error} Se não for implementado na subclasse.
     */
    update() {
      throw new Error("O método 'update' deve ser implementado na subclasse.");
    }
    
    /**
     * Renderiza a entidade na tela.
     * Este método deve ser implementado nas subclasses.
     * @throws {Error} Se não for implementado na subclasse.
     */
    draw() {
      throw new Error("O método 'draw' deve ser implementado na subclasse.");
    }
  }
  
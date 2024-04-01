const healingEffects = ["Revive", "Mass Heal", "Support", "Shield"];
const attackEffects = ["Shock", "Strike", "Ultimate Strike", "Burn", "Double Hit", "Melee"];

function defendAttack(attackCard, defenseCard) {
  if (!attackEffects.includes(attackCard.effects)) {
    return null;
    // In practice this should throw an error and let the user know to choose another card, easier to test this way though
    // Or it should already have been verified in some attackWith() function?
  }
  if (!healingEffects.includes(defenseCard.effects)) {
    return attackCard.power;
  }
  if (attackCard.power - defenseCard.power < 0) {
    return 0;
  }
  return attackCard.power - defenseCard.power;
}

module.exports = defendAttack;

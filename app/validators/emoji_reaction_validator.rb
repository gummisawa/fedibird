# frozen_string_literal: true

class EmojiReactionValidator < ActiveModel::Validator
  SUPPORTED_EMOJIS = Oj.load(File.read(Rails.root.join('app', 'javascript', 'mastodon', 'features', 'emoji', 'emoji_map.json'))).keys.freeze
  LIMIT = 8

  def validate(reaction)
    return if reaction.name.blank?

    reaction.errors.add(:name, I18n.t('reactions.errors.unrecognized_emoji')) if reaction.custom_emoji_id.blank? && !unicode_emoji?(reaction.name)
    reaction.errors.add(:base, I18n.t('reactions.errors.limit_reached')) if new_reaction?(reaction) && limit_reached?(reaction)

  end

  private

  def unicode_emoji?(name)
    SUPPORTED_EMOJIS.include?(name)
  end

  def new_reaction?(reaction)
    !reaction.status.emoji_reactions.where(name: reaction.name).exists?
  end

  def limit_reached?(reaction)
    reaction.status.emoji_reactions.where.not(name: reaction.name).count('distinct name') >= LIMIT
  end
end

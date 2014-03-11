json.array!(@letters) do |letter|
  json.extract! letter, :id, :message, :tag
  json.url letter_url(letter, format: :json)
end

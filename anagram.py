from random import choice
from string_utils import shuffle

class Anagram:
	def __init__(self, language):
		self.shuffled_word = ""
		self.language = language
		self.wordlist = self.open_wordlist()

	def open_wordlist(self):
		with open('wordlist/' + self.language + "_wordlist.txt", 'r', encoding="utf-8") as word_object:
			string_list = word_object.read()
			words = string_list.split()
			wordlist = {word: index for index, word in enumerate(words)}
			return wordlist

	def create_anagram(self):
		word, index = choice(list(self.wordlist.items()))
		self.shuffled_word = shuffle(word)
		return [self.shuffled_word, word, index]

	def check_solution(self, shuffled_word, word):
		for i in word:
			if i not in shuffled_word or word.count(i) > shuffled_word.count(i):
					return 1, "No shuffled match"
		if word in self.wordlist:
			return 0, len(word)
		return 1, "Unknown word"

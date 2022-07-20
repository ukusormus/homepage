---
title: My kood/Jõhvi Selection Sprint Experience
date: 2022-07-17T17:39:44.175Z
author: Uku Sõrmus
summary: 3 weeks of coding in Go and interesting people from around the world.
tags:
  - school
---
Content will be here... soon!

![blue gopher running up the ladder](https://go.dev/images/gophers/ladder.svg "image title")

[Sample link](https://ukusormus.com/about)



## Heading 2

# Heading 1

### Heading 3



* bullet points
* ...



1. numbered
2. list



```go
package main

import (
	"fmt"

	"sudoku/helpers"
)

// Gets a Sudoku board from program arguments and outputs a solved board,
// if input is valid.
//
// Example input: ".96.4...1" "1...6...4" "5.481.39." "..795..43" ".3..8...." "4.5.23.18" ".1.63..59" ".59.7.83." "..359...7"
func main() {
	// Get board; exit on invalid input
	var board [][]int = helpers.GetBoardAndValidate()
	if board == nil {
		fmt.Println("Error")
		return
	}

	// Try to solve and print solved board (board variable is being directly modified).
	// isSolved should never be false, since a valid board is passed to BacktrackingSolver
	var isSolved bool = helpers.BacktrackingSolver(board, 0, 0)
	if isSolved {
		helpers.PrintBoard(board)
	} else {
		fmt.Println("Error")
	}
}

```
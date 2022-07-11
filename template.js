#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const readline = require('readline')

let rl
let type = process.argv[2]
let name = process.argv[3]
let directory = process.argv[4] || '.'

const htmlTemplate = `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>Template</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>CLI</p>
  </body>
</html>
`

const routerTemplate = `
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
	try {
		res.send('ok')
	} catch (error) {
		console.error(error)
		next(error)
	}
})

module.exports = router
`
// 폴더 존재 여부 확인 함수
const exist = (dir) => {
  try {
    fs.accessSync(
      dir,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
    )
    return true
  } catch (error) {
    return false
  }
}

// 경로 생성 함수
const mkdirp = (dir) => {
  const dirname = path
    .relative('.', path.normalize(dir))
    .split(path.sep)
    .filter((p) => !!p)
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep)
    if (!fs.existsSync(pathBuilder)) {
      fs.mkdirSync(pathBuilder)
    }
  })
}

// 템플릿 생성 함수
const makeTemplate = () => {
  mkdirp(directory)
  if (type === 'html') {
    const pathToFile = path.join(directory, `${name}.html`)
    if (exist(pathToFile)) {
      console.error('이미 해당 파일이 존재합니다.')
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate)
      console.log(pathToFile, '생성 완료')
    }
  } else if (type === 'express-router') {
    const pathToFile = path.join(directory, `${name}.js`)
    if (exist(pathToFile)) {
      console.error('이미 해당 파일이 존재합니다.')
    } else {
      fs.writeFileSync(pathToFile, routerTemplate)
      console.log('생성 완료')
    }
  } else {
    console.error('html 또는 express-router 둘 중 하나를 입력하세요.')
  }
}

// 경로 설정
const dirAnswer = (answer) => {
  directory = (answer && answer.trim()) || '.'
  rl.close()
  makeTemplate()
}

// 파일명 설정
const nameAnswer = (answer) => {
  if (!answer || !answer.trim()) {
    console.clear()
    console.log('name을 반드시 입력하셔야 합니다.')
    return rl.question('파일명을 설정하세요. ', nameAnswer)
  }
  name = answer
  return rl.question(
    '저장할 경로를 설정하세요. (설정하지 않으면 현재 경로) ',
    dirAnswer
  )
}

// 템플릿 종류 설정
const typeAnswer = (answer) => {
  if (answer !== 'html' && answer !== 'express-router') {
    console.clear()
    console.log('html 또는 express-router만 지원합니다.')
    return rl.question('어떤 템플릿이 필요하십니까?', typeAnswer)
  }
  type = answer
  return rl.question('파일명을 설정하세요. ', nameAnswer)
}

const program = () => {
  if (!type || !name) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    console.clear()
    rl.question('어떤 템플릿이 필요하십니까?', typeAnswer)
  } else {
    makeTemplate()
  }
}

program() // 프로그램 실행부

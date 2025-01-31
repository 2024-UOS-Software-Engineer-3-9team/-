# Project Title
<b>일조매</b> (<b>일</b>을 <b>조</b>금씩 <b>매</b>일매일)
<br>

## Project Team Name
<b>너나해</b> (<b>너</b>랑 <b>나</b>랑 <b>해</b>보자)
<br>

## Project Scope
서울시립대학교 컴퓨터과학부 2024년 소프트웨어공학 프로젝트로, Software Development Life-Cycle을 기반으로 객체지향 소프트웨어 공학 방법론을 적용하여 팀 프로젝트 진행 보조 애플리케이션 <일조매> 개발
<br>

## Project Duration
2024년 2학기
<br>

# Project Description
### [개발 목적]
- 팀 프로젝트를 진행하다 보면 직무 유기, 시간 조율의 어려움 등 프로젝트의 진행을 방해하는 상황이 발생한다. <일조매>는 업무 분배 및 독촉 기능, 회의 시간 조율 기능 등의 팀 프로젝트 보조 기능을 제공하여 팀 프로젝트의 순탄한 진행을 돕고자 한다.

### [사용 대상]
- 팀 프로젝트가 필요한 사람들 (ex.개발 동아리, 조별 과제를 하는 대학생들)
<br>

## Highlighted Features
#### [구현 features]
|  | Feature | Description | 
|-|:------:|--------------|
|1| 팀 프로젝트 기능 | 사용자는 팀 프로젝트를 생성하여 다른 사용자를 초대할 수 있다. |
|2| Task 기능 | 조별과제에서 각 팀원이 맡은 일을 'Task'라는 이름의 to do list 형태로 표시한다. <br> Task의 마감일, 담당자가 함께 표시된다. |
|3| Schedule 기능 | 각 팀원이 회의 참여 가능한 시간대를 입력하면 모든 팀원이 가능한 시간대를 계산해준다. <br> 팀장은 이를 바탕으로 회의 시간을 설정할 수 있다. |
|4| 재촉 알림 기능 | 각 Task 별로 재촉 버튼이 있어 다른 팀원이 재촉 버튼을 누르면 Task 담당자의 핸드폰에 알림이 간다. |

#### [Demo Video]
- (https://youtu.be/xPJ7QnxGDP4)
<br>

## Project Constraints
- 본 프로젝트는 한 학기 내에 완료되어야 한다. 12/10(화) 최종 발표에 맞춰, 12/8(일)까지 모든 개발 및 테스트가 완료되었다.
- '일조매'는 크로스 플랫폼으로 개발되었다. 즉, 웹 브라우저와 모바일 앱을 모두 지원한다.
- 안드로이드 기준으로만 개발되었다.
- 웹과 앱의 효율적인 연동을 위해 프론트엔드는 자바스크립트를 기반으로 한 React와 React Native를 사용하여 구현하였다. 백엔드는 React와의 호환성을 고려해 RESTful API를 지원하는 Node.js를 채택하였다. 데이터베이스는 Oracle을 기반으로 하며, SQL Developer를 사용하여 관리한다.
- 모든 구현은 가상 서버 환경에서 이루어졌으며, Amazon Web Services(AWS)의 EC2 인스턴스를 이용해 가상 서버를 운영한다.
- '팀원끼리 시간 맞추는 기능'의 경우, 팀원이 입력할 수 있는 가능한 시간대는 1시간 단위로 한다.
<br>

## High Level Architecture
![High_Level_Architecture](https://github.com/user-attachments/assets/509b1a36-2180-44cc-99ad-e6798c76e70f)
<br>

## Technology Stacks
| Field | Tools |
|:------:|:----:|
| Front-end | Figma / React Native / expo |
| Back-end | Node.js / Express.js |
| DataBase | SQL developer (ORACLE 기반) |

## Installation Guideline
배포 파일 설치 </br>
https://expo.dev/artifacts/eas/mbBU1qPT6euP1K3LrYxWFe.apk

개발 환경 구축 </br>
https://github.com/expo/expo/tree/main/templates/expo-template-default </br>
위의 링크로 들어가서 template을 먼저 구축(통째로 다운하고 npm install)한 후</br>
본 프로젝트의 pages(app 폴더, https://github.com/2024-UOS-Software-Engineer-3-9team/Small-Work-Everyday/tree/main/front-app/app) 를</br>
다운 받은 template의 app 폴더에 붙여넣으면 됩니다!

## Project Deliverables
| Document | Link |
|----------|-------|
| 요구사항 분석 명세서 | https://github.com/2024-UOS-Software-Engineer-3-9team/Small-Work-Everyday/blob/main/artifacts/SRS_%EB%84%88%EB%82%98%ED%95%B4.docx |
| Software Architecture 및 Design | https://github.com/2024-UOS-Software-Engineer-3-9team/Small-Work-Everyday/blob/main/artifacts/High-level%20Architecture%20UML%20Diagrams%20Document_%EB%84%88%EB%82%98%ED%95%B420241214.docx |
| UI Design | https://github.com/2024-UOS-Software-Engineer-3-9team/Small-Work-Everyday/blob/main/artifacts/UI%20Design%20Document_%EB%84%88%EB%82%98%ED%95%B4.docx |
| Coding Standard | https://github.com/2024-UOS-Software-Engineer-3-9team/Small-Work-Everyday/blob/main/artifacts/Coding%20Standard_%EB%84%88%EB%82%98%ED%95%B4.docx |
| Code | 프론트: https://github.com/2024-UOS-Software-Engineer-3-9team/Small-Work-Everyday/tree/main/front-app </br>백: https://github.com/2024-UOS-Software-Engineer-3-9team/Small-Work-Everyday/tree/main/backend | 
| Test case 및 결과 | https://github.com/2024-UOS-Software-Engineer-3-9team/Small-Work-Everyday/blob/main/artifacts/%EC%9D%BC%EC%A1%B0%EB%A7%A4%ED%8C%80%20Test%20Cases.xlsx |

## Repository Structure
| Directory Name | Contents |
|:--------------:|-------------|
| /README | all descriptions about this project |
| /proposal/SOW.md | project proposal |
| /artifacts | **[Requirements]** <br> - SRS_너나해.docx *최신 버전으로 업데이트해야 함 <br> - SRS-review.docx <br><br> **[High-level Architecture]** <br> - High-level Architecture UML Diagrams Document_너나해.docx <br><br> **[UML Design]** <br> - class_diagram_for_static_view.uxf <br> - sequence_for_usecase_task.uxf <br> - sequence_for_usecase_schedule.uxf <br><br> **[UI Design]** <br> - UI Design Document_너나해.docx <br> - figma_전체사진.png <br> - figma_flow.png <br> - 일조매.fig <br><br> **[Coding Standard]** <br> - Coding Standard_너나해.docx <br><br> **[Test Case]** <br> - 일조매팀 Test Cases.xlsx |
| /reports | - midterm presentation slides <br> - final presentation slides <br> - demo video |
| /UI, 피그마 | UI design 스크린샷 및 figma codes |
| /front-app | - react native code <br> - 설정 파일 <br> - font <br> - icons |
| /backend | bakc-end api |
| /database | database 구조 |
| /classroom | 수업시간에 사용한 문서들 |

## Project Team Members
| Student Number | Name | Role | etc |
|:--------------:|------|:----:|------|
| 2020920002 | 구효근 | Front-end | 조장 |
| 2020920019 | 문윤서 | Front-end | |
| 2020920037 | 유지호 | Back-end | |
| 2022920001 | 강민지 | Database | |
| 2022920007 | 김나린 | Database | |
| 2022920022 | 류수화 | API 통신 | |

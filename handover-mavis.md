Mavis님, VTM 관련 인수인계 공유드립니다.

먼저 반영이 늦어진 부분은 죄송합니다. 다만 VTM이 제 메인 업무가 아니다보니 여러 작업을 병렬로 진행하고 있어서, 말씀하신 내용을 놓치는 경우가 생길 수 있습니다. 급하거나 확인이 필요한 건은 호현님 통해서가 아니라 저한테 직접 DM 주세요. 저한테 직접 말씀 안 하시면 제가 인지를 못합니다. 본인 업무 일정에 맞춰서 진행하셔야 하는 거면 더더욱 직접 연락 주셔야 시간 안에 대응이 가능합니다.

현재 기준으로 플로우 정리해드립니다.

---

[VTM 운영 플로우]

1. 시트 동기화 (후보자 불러오기)
- Admin > Candidate Management > Sync Sheet 클릭
- Google Sheets에 새로 추가된 후보자들이 "스크리닝 대기" 상태로 들어옵니다
- 참고: 현재 ITviec, LinkedIn만 CV 자동 수집됨. 나머지 소스는 CV가 안 가져와져서 LLM 스크리닝 불가합니다.

2. JD 등록 및 배정
- Admin > JD Management에서 JD 직접 추가해주세요
- 기존 JD는 채용위크 때 급하게 하드코딩으로 넣은 거라 자동 동기화가 안 됩니다
- JD가 없는 후보자는 스크리닝이 안 되니, JD 등록 후 해당 후보자 클릭 > JD 배정까지 해주셔야 합니다

3. LLM 스크리닝
- JD 배정된 대기 후보자가 있으면 LLM Screening 버튼 클릭
- AI가 CV + JD 매칭해서 자동으로 합격/불합격 분류합니다
- 스크리닝 안 되는 경우: CV 없음 / JD 미배정

4. 단체 발송
- 스크리닝 합격자 중 발송 대상 필터링 > 선택
- 전체 발송 클릭 > 마감일자 설정 후 발송

5. AI 인터뷰 확인
- Admin > AI Interview에서 진행도 확인 가능합니다

---

순서 정리:
1. 시트 동기화 → Candidate Management
2. JD 등록 → JD Management
3. 후보자에 JD 배정 → JD Management
4. LLM 스크리닝 실행 → Candidate Management
5. 합격자 필터 > 단체 발송 → Candidate Management
6. 인터뷰 진행도 확인 → AI Interview

막히는 부분 있으면 DM 주세요.

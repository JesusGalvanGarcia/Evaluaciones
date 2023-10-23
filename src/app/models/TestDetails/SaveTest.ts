export  class Moduled {
    id: number;
    note: string;
    answers: Answered[];
}
export  class Answered {
    id: number;
    question_id: number;
    score: number;
  }
  export class UserTest {
    user_id: number;
    user_test_id: number;
    modules: Moduled[];
  }
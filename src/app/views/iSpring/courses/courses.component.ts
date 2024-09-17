import { Component } from '@angular/core';
import { CourseService } from '@services/iSpring/course.service';
import { UserCourseService } from '@services/iSpring/user-course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  courses: any

  loading: boolean = true

  constructor(
    private _userCourseService: UserCourseService,
    private _CourseService: CourseService
  ) {

    this.getUserCourses();

  }

  ngOninit() {
  }

  getUserCourses() {

    const searchData = {
      user_id: Number(localStorage.getItem("user_id")),
    }

    this._userCourseService.GetUserCourses(searchData).
      then(({ result }) => {

        this.loading = false;

        this.courses = result;
      })
      .catch(({ title, message, code }) => {

        this.loading = false;
        console.log(message)
      })
  }

  openLinkInNewWindow(course_Id: string) {

    this.loading = true;

    this._CourseService.GetCourseInfo(course_Id).
      then(({ contentItem }) => {

        this.loading = false;

        window.open(contentItem.viewUrl, '_blank');
      })
      .catch(({ title, message, code }) => {

        this.loading = false;
        console.log(message)
      })

  }

}

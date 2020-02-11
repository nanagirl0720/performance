package com.xima.per;

import com.xima.per.entity.User;
import com.xima.per.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;

@RunWith(value= SpringJUnit4ClassRunner.class)
@SpringBootTest
class PerformanceApplicationTests {

    @Test
    void contextLoads() {
    }

    @Autowired
    private UserService userService;

    public void createUser(){
        User user = new User();
        user.setUsername("dz");
        user.setPassword("123");
        user.setDate(new Date());
        userService.save(user);
    }
}

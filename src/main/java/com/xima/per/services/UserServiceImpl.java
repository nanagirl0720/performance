package com.xima.per.services;

import com.xima.per.dao.UserDao;
import com.xima.per.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * @author zd
 * @version v1.0
 * @2020 02 10 21 24
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;


    public User save(User user){
        return  userDao.save(user);
    }

    public void delete(User user){
        userDao.delete(user);
    }

    @Override
    public void deleteById(Integer id) {
        userDao.deleteById(id);
    }

    @Override
    public List<User> findAll(){
        return userDao.findAll();
    }

    public User getOne(Integer id){
        return userDao.getOne(id);
    }

    public User findById(Integer id){
        Optional<User> byId = userDao.findById(id);
        User one = userDao.getOne(id);
        if (byId.isPresent()){
            return byId.get();
        } else {
            return null;
        }
    }

   /* @Override
    public Page<User> getPageNum(@PageableDefault(value = 5,sort = {"username"}) Pageable pageable){
        return  pageRepository.getEntryByPageable(pageable);
    }*/
}
